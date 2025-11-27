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
                    nama_ppp,
                    nama_ppk,
                    nama_php,
                    rencana,
                    realisasi,
                    keterangan,
                    team_lead,
                } = req.body;

                const deviasi = Number(realisasi) - Number(rencana);
                const kendala = deviasi < 0;

                const monitoring = await prisma.monitoring.create({
                    data: {
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        jangka_waktu: Number(jangka_waktu),
                        nama_ppp,
                        nama_ppk,
                        nama_php,
                        rencana: Number(rencana),
                        realisasi: Number(realisasi),
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId
                    }
                })

                const monitoringhistory = await prisma.monitoringHistory.create({
                    data: {
                        monitoring_id: monitoring.id,
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        jangka_waktu: Number(jangka_waktu),
                        nama_ppp,
                        nama_ppk,
                        nama_php,
                        rencana: Number(rencana),
                        realisasi: Number(realisasi),
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId
                    }
                })

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
                    pelaksana_pekerjaan,
                    jangka_waktu,
                    nama_ppp,
                    nama_ppk,
                    nama_php,
                    rencana,
                    realisasi,
                    keterangan,
                    team_lead,
                } = req.body;
                
                const deviasi = Number(realisasi) - Number(rencana);
                const kendala = deviasi < 0;

                const monitoring = await prisma.monitoring.update({
                    where: { id },
                    data: {
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        jangka_waktu,
                        nama_ppp,
                        nama_ppk,
                        nama_php,
                        rencana,
                        realisasi,
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId,
                        
                    }
                })

                const monitoringhistory = await prisma.monitoringHistory.create({
                    data: {
                        monitoring_id: monitoring.id,
                        nama_proyek,
                        no_kontrak,
                        pelaksana_pekerjaan,
                        jangka_waktu,
                        nama_ppp,
                        nama_ppk,
                        nama_php,
                        rencana,
                        realisasi,
                        deviasi,
                        kendala,
                        keterangan,
                        team_lead: userId,
                            
                    }
                })


                res.json({message: "Project updated successfully"})
            } catch (error) {
                //console.log(error);
                res.status(500).json({ message: error.code || error.message })
            }
        })

        

        // // Add members to project if they're in the workspace
        // if(team_members?.length > 0) {
        //     const membersToAdd = []
        //     workspace.members.forEach(member => {
        //         if(team_members.includes(member.user.email)){
        //             membersToAdd.push(member.user.id)
        //         }
        //     })
        //     await prisma.projectMember.createMany({
        //         data:
        //         membersToAdd.map(memberId => ({
        //             projectId: project.id,
        //             userId: memberId
        //         }))
        //     })
        // }

        // const projectWithMembers = await prisma.project.findUnique({
        //     where: {id: project.id},
        //     include: {
        //         members: {include: {user: true}},
        //         tasks: {include: {assignee: true, comments: {include: {user: true}}}},
        //         owner: true
        //     }
        // })

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
            pelaksana_pekerjaan,
            jangka_waktu,
            nama_ppp,
            nama_ppk,
            nama_php,
            rencana,
            realisasi,
            keterangan,
            team_lead,
        } = req.body;

        const deviasi = Number(realisasi) - Number(rencana);
        const kendala = deviasi < 0;

        const monitoring = await prisma.monitoring.update({
            where: { id },
            data: {
                nama_proyek,
                no_kontrak,
                pelaksana_pekerjaan,
                jangka_waktu,
                nama_ppp,
                nama_ppk,
                nama_php,
                rencana,
                realisasi,
                deviasi,
                kendala,
                keterangan,
                team_lead: userId
            }
        })

        const monitoringhistory = await prisma.monitoringHistory.create({
            data: {
                monitoring_id: monitoring.id,
                nama_proyek,
                no_kontrak,
                pelaksana_pekerjaan,
                jangka_waktu,
                nama_ppp,
                nama_ppk,
                nama_php,
                rencana,
                realisasi,
                deviasi,
                kendala,
                keterangan,
                team_lead: userId,
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

