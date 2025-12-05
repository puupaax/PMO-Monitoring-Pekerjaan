        import prisma from "../config/prisma.js";
        import ExcelJS from "exceljs";
        import fs from "fs";


        // Create project
        export const createProject = async(req, res) => {
            
            try {
                const {userId} = await req.auth();
                const {
                    nama_proyek,
                    no_kontrak,
                    pelaksana_pekerjaan,
                    jangka_waktu,
                    tgl_kontrak,
                    start_proyek,
                    end_proyek,
                    start_pemeliharaan,
                    end_pemeliharaan,
                    nama_ppp,
                    nama_ppk,
                    nama_php,
                    rencana,
                    realisasi,
                    keterangan,
                    team_lead,
        
                    nilai_proyek,
                    masa_pemeliharaan,
                    personil: personilStr
                } = req.body;

                // Parse personil JSON
                let personil = {
                    pyb: [],
                    koordinator_ppik: "",
                    anggota_ppik: [],
                    anggota_ppp: [],
                    ketua_php: "",
                    anggota_php: []
                };

                if (personilStr) {
                    try {
                        personil = JSON.parse(personilStr);
                    } catch (e) {
                        console.error("Error parsing personil:", e);
                    }
                }

                const deviasi = Number(realisasi) - Number(rencana);
                const kendala = deviasi < 0;

        // if(!workspace.members.some((member)=> member.userId === userId && member.role === "ADMIN")){
        //     return res.status(403).json({ message: "You don't have permission to create projects in this workspace" });
        // }

        // Get Team Lead using email
        // const teamLead = await prisma.user.findUnique({
        //     where: {email: team_lead},
        //     select: {id: true}
        // })

                const monitoring = await prisma.monitoring.create({
                    data: {
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        jangka_waktu: Number(jangka_waktu),
                        tgl_kontrak: new Date(req.body.tgl_kontrak),
                        start_proyek: new Date(req.body.start_proyek),
                        end_proyek: new Date(req.body.end_proyek),
                        start_pemeliharaan: new Date(req.body.start_pemeliharaan),
                        end_pemeliharaan: new Date(req.body.end_pemeliharaan),
                        nama_ppp,
                        nama_ppk,
                        nama_php,
                        rencana: Number(rencana),
                        realisasi: Number(realisasi),
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId,

                        nilai_proyek: Number(nilai_proyek),
                        masa_pemeliharaan: Number(masa_pemeliharaan),
                    }
                })

                const monitoringhistory = await prisma.monitoringHistory.create({
                    data: {
                        monitoring_id: monitoring.id,
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        tgl_kontrak: new Date(req.body.tgl_kontrak),
                        jangka_waktu: Number(jangka_waktu),
                        nama_ppp,
                        nama_ppk,
                        nama_php,
                        rencana: Number(rencana),
                        realisasi: Number(realisasi),
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId,

                        nilai_proyek: Number(nilai_proyek),
                        masa_pemeliharaan: Number(masa_pemeliharaan),
                        start_proyek: new Date(req.body.start_proyek),
                        end_proyek: new Date(req.body.end_proyek),
                        start_pemeliharaan: new Date(req.body.start_pemeliharaan),
                        end_pemeliharaan: new Date(req.body.end_pemeliharaan),
                    }
                })

                // SIMPAN PERSONIL KE DATABASE
                // ============================
                if (personil) {
                    // Fetch semua user yang diperlukan untuk mendapatkan nama
                    const allUserIds = [
                        ...personil.pyb,
                        personil.koordinator_ppik,
                        ...personil.anggota_ppik,
                        ...personil.anggota_ppp,
                        personil.ketua_php,
                        ...personil.anggota_php
                    ].filter(id => id);

                    const uniqueUserIds = [...new Set(allUserIds)];
                    
                    const userMap = {};
                    if (uniqueUserIds.length > 0) {
                        const users = await prisma.user.findMany({
                            where: { id: { in: uniqueUserIds } },
                            select: { id: true, name: true }
                        });
                        users.forEach(u => {
                            userMap[u.id] = u.name;
                        });
                    }

                    // Step 1: Create all personil without atasan_id first
                    const personilWithoutHierarchy = [];

                    // PYB - bisa lebih dari 1 orang
                    if (personil.pyb && Array.isArray(personil.pyb)) {
                        personil.pyb.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: monitoring.id,
                                    nama: userMap[userId] || userId,
                                    role: "PYB",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // KOORDINATOR PPIK - 1 orang
                    if (personil.koordinator_ppik) {
                        personilWithoutHierarchy.push({
                            monitoring_id: monitoring.id,
                            nama: userMap[personil.koordinator_ppik] || personil.koordinator_ppik,
                            role: "KOORDINATOR_PPIK",
                            atasan_id: null
                        });
                    }

                    // ANGGOTA PPIK - tanpa atasan_id dulu
                    if (personil.anggota_ppik && Array.isArray(personil.anggota_ppik)) {
                        personil.anggota_ppik.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: monitoring.id,
                                    nama: userMap[userId] || userId,
                                    role: "ANGGOTA_PPIK",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // KETUA PHP - 1 orang
                    if (personil.ketua_php) {
                        personilWithoutHierarchy.push({
                            monitoring_id: monitoring.id,
                            nama: userMap[personil.ketua_php] || personil.ketua_php,
                            role: "KETUA_PHP",
                            atasan_id: null
                        });
                    }

                    // ANGGOTA PHP - tanpa atasan_id dulu
                    if (personil.anggota_php && Array.isArray(personil.anggota_php)) {
                        personil.anggota_php.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: monitoring.id,
                                    nama: userMap[userId] || userId,
                                    role: "ANGGOTA_PHP",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // ANGGOTA PPP - tanpa atasan_id
                    if (personil.anggota_ppp && Array.isArray(personil.anggota_ppp)) {
                        personil.anggota_ppp.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: monitoring.id,
                                    nama: userMap[userId] || userId,
                                    role: "ANGGOTA_PPP",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // Bulk insert personil
                    if (personilWithoutHierarchy.length > 0) {
                        await prisma.personilMonitoring.createMany({
                            data: personilWithoutHierarchy
                        });
                    }

                    // Step 2: Now fetch all created personil and setup hierarchy
                    const allPersonil = await prisma.personilMonitoring.findMany({
                        where: { monitoring_id: monitoring.id }
                    });

                    // Update ANGGOTA PPIK dengan atasan = KOORDINATOR PPIK
                    if (personil.koordinator_ppik && personil.anggota_ppik?.length > 0) {
                        const koordinator = allPersonil.find(p => p.role === "KOORDINATOR_PPIK");
                        if (koordinator) {
                            const anggotaPPIK = allPersonil.filter(p => p.role === "ANGGOTA_PPIK");
                            for (const anggota of anggotaPPIK) {
                                await prisma.personilMonitoring.update({
                                    where: { id: anggota.id },
                                    data: { atasan_id: koordinator.id }
                                });
                            }
                        }
                    }

                    // Update ANGGOTA PHP dengan atasan = KETUA PHP
                    if (personil.ketua_php && personil.anggota_php?.length > 0) {
                        const ketua = allPersonil.find(p => p.role === "KETUA_PHP");
                        if (ketua) {
                            const anggotaPHP = allPersonil.filter(p => p.role === "ANGGOTA_PHP");
                            for (const anggota of anggotaPHP) {
                                await prisma.personilMonitoring.update({
                                    where: { id: anggota.id },
                                    data: { atasan_id: ketua.id }
                                });
                            }
                        }
                    }
                }

                // SIMPAN EXCEL KE DATABASE
                // =======================
                if (req.file) {

                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(req.file.buffer); // karena multer pakai memoryStorage

                const sheet = workbook.worksheets[0];
                const insertData = [];

                sheet.eachRow((row, index) => {

                    // SKIP HEADER
                    if (index === 1) return;

                    const minggu = Number(row.getCell(1).value);
                    const progress = Number(row.getCell(2).value);

                    // VALIDASI DATA
                    if (!minggu || isNaN(progress)) return;

                    insertData.push({
                    monitoring_id: monitoring.id,
                    minggu,
                    progress
                    });
                });

                // INSERT BATCH
                if (insertData.length > 0) {
                    await prisma.rencanaKerja.createMany({
                    data: insertData
                    });
                }
                }
                res.json({ message: "Project created successfully"})
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: error.code || error.message })
            }
        }

        // Update project
        export const updateProject = async(req, res) => {
            try {
                const {userId} = await req.auth();
                const {
                    id,
                    nama_proyek,
                    no_kontrak,
                    nilai_proyek,
                    pelaksana_pekerjaan,
                    jangka_waktu,
                    masa_pemeliharaan,
                    // nama_ppp,
                    // nama_ppk,
                    // nama_php,
                    rencana,
                    realisasi,
                    keterangan,
                    team_lead,
                    personil: personilStr,

                    start_proyek,
                    end_proyek,
                    start_pemeliharaan,
                    end_pemeliharaan,
                } = req.body;

                // Parse personil JSON
                let personil = {
                    pyb: [],
                    koordinator_ppik: "",
                    anggota_ppik: [],
                    anggota_ppp: [],
                    ketua_php: "",
                    anggota_php: []
                };

                if (personilStr) {
                    try {
                        personil = JSON.parse(personilStr);
                    } catch (e) {
                        console.error("Error parsing personil:", e);
                    }
                }
                
                const deviasi = Number(realisasi) - Number(rencana);
                const kendala = deviasi < 0;

                const monitoring = await prisma.monitoring.update({
                    where: { id },
                    data: {
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        jangka_waktu,
                        // nama_ppp,
                        // nama_ppk,
                        // nama_php,
                        rencana,
                        realisasi,
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId,

                        start_proyek: new Date(req.body.start_proyek),
                        end_proyek: new Date(req.body.end_proyek),
                        start_pemeliharaan: new Date(req.body.start_pemeliharaan),
                        end_pemeliharaan: new Date(req.body.end_pemeliharaan),
                        nilai_proyek,
                        masa_pemeliharaan,
                    }
                })

                const monitoringhistory = await prisma.monitoringHistory.create({
                    data: {
                        monitoring_id: monitoring.id,
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        jangka_waktu,
                        start_proyek: new Date(req.body.start_proyek),
                        end_proyek: new Date(req.body.end_proyek),
                        start_pemeliharaan: new Date(req.body.start_pemeliharaan),
                        end_pemeliharaan: new Date(req.body.end_pemeliharaan),
                        // nama_ppp,
                        // nama_ppk,
                        // nama_php,
                        rencana,
                        realisasi,
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId,

                        nilai_proyek,
                        masa_pemeliharaan,            
                    }
                })

                // UPDATE PERSONIL
                // ===============
                if (personil) {
                    // Hapus personil lama
                    await prisma.personilMonitoring.deleteMany({
                        where: { monitoring_id: id }
                    });

                    // Fetch semua user yang diperlukan untuk mendapatkan nama mereka
                    const allUserIds = [
                        ...personil.pyb,
                        personil.koordinator_ppik,
                        ...personil.anggota_ppik,
                        ...personil.anggota_ppp,
                        personil.ketua_php,
                        ...personil.anggota_php
                    ].filter(id => id);

                    const uniqueUserIds = [...new Set(allUserIds)];
                    
                    const userMap = {};
                    if (uniqueUserIds.length > 0) {
                        const users = await prisma.user.findMany({
                            where: { id: { in: uniqueUserIds } },
                            select: { id: true, name: true }
                        });
                        users.forEach(u => {
                            userMap[u.id] = u.name;
                        });
                    }

                    // Step 1: Create all personil without atasan_id first
                    const personilWithoutHierarchy = [];

                    // PYB - bisa lebih dari 1 orang
                    if (personil.pyb && Array.isArray(personil.pyb)) {
                        personil.pyb.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: id,
                                    nama: userMap[userId] || userId,
                                    role: "PYB",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // KOORDINATOR PPIK - 1 orang
                    if (personil.koordinator_ppik) {
                        personilWithoutHierarchy.push({
                            monitoring_id: id,
                            nama: userMap[personil.koordinator_ppik] || personil.koordinator_ppik,
                            role: "KOORDINATOR_PPIK",
                            atasan_id: null
                        });
                    }

                    // ANGGOTA PPIK - tanpa atasan_id dulu
                    if (personil.anggota_ppik && Array.isArray(personil.anggota_ppik)) {
                        personil.anggota_ppik.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: id,
                                    nama: userMap[userId] || userId,
                                    role: "ANGGOTA_PPIK",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // KETUA PHP - 1 orang
                    if (personil.ketua_php) {
                        personilWithoutHierarchy.push({
                            monitoring_id: id,
                            nama: userMap[personil.ketua_php] || personil.ketua_php,
                            role: "KETUA_PHP",
                            atasan_id: null
                        });
                    }

                    // ANGGOTA PHP - tanpa atasan_id dulu
                    if (personil.anggota_php && Array.isArray(personil.anggota_php)) {
                        personil.anggota_php.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: id,
                                    nama: userMap[userId] || userId,
                                    role: "ANGGOTA_PHP",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // ANGGOTA PPP - tanpa atasan_id
                    if (personil.anggota_ppp && Array.isArray(personil.anggota_ppp)) {
                        personil.anggota_ppp.forEach(userId => {
                            if (userId) {
                                personilWithoutHierarchy.push({
                                    monitoring_id: id,
                                    nama: userMap[userId] || userId,
                                    role: "ANGGOTA_PPP",
                                    atasan_id: null
                                });
                            }
                        });
                    }

                    // Bulk insert personil
                    if (personilWithoutHierarchy.length > 0) {
                        await prisma.personilMonitoring.createMany({
                            data: personilWithoutHierarchy
                        });
                    }

                    // Step 2: Now fetch all created personil and setup hierarchy
                    const allPersonil = await prisma.personilMonitoring.findMany({
                        where: { monitoring_id: id }
                    });

                    // Update ANGGOTA PPIK dengan atasan = KOORDINATOR PPIK
                    if (personil.koordinator_ppik && personil.anggota_ppik?.length > 0) {
                        const koordinator = allPersonil.find(p => p.role === "KOORDINATOR_PPIK");
                        if (koordinator) {
                            const anggotaPPIK = allPersonil.filter(p => p.role === "ANGGOTA_PPIK");
                            for (const anggota of anggotaPPIK) {
                                await prisma.personilMonitoring.update({
                                    where: { id: anggota.id },
                                    data: { atasan_id: koordinator.id }
                                });
                            }
                        }
                    }

                    // Update ANGGOTA PHP dengan atasan = KETUA PHP
                    if (personil.ketua_php && personil.anggota_php?.length > 0) {
                        const ketua = allPersonil.find(p => p.role === "KETUA_PHP");
                        if (ketua) {
                            const anggotaPHP = allPersonil.filter(p => p.role === "ANGGOTA_PHP");
                            for (const anggota of anggotaPHP) {
                                await prisma.personilMonitoring.update({
                                    where: { id: anggota.id },
                                    data: { atasan_id: ketua.id }
                                });
                            }
                        }
                    }
                }

                res.json({message: "Project updated successfully"})
            } catch (error) {
                //console.log(error);
                res.status(500).json({ message: error.code || error.message })
            }
        }

        export const deleteMonitor = async(req, res) => {
            try {
                const { userId } = await req.auth();
                const { monitorId } = req.params;

                await prisma.monitoringHistory.deleteMany({
                    where: { monitoring_id: monitorId }
                });

                await prisma.monitoring.delete({
                    where: { id: monitorId }
                })
                res.json({ message: "Monitoring deleted successfully" });
            } catch (error) {
                //console.log(error);
                res.status(500).json({ message: error.code || error.message })
            }
        }

        export const previewExcel = async (req, res) => {
        try {
            if (!req.file) {
            return res.status(400).json({ message: "File Excel belum diupload" });
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(req.file.buffer);

            const sheet = workbook.worksheets[0];
            const preview = [];

            sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const minggu = row.getCell(1).value;
            const progress = row.getCell(2).value;

            if (!minggu || progress === null) return;

            preview.push({
                minggu: Number(minggu),
                progress: parseFloat(progress)
            });
            });

            res.json({
            message: "Preview berhasil",
            data: preview
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Gagal membaca Excel" });
        }
        };

