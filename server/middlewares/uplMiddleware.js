// Upload middleware disabled for Vercel (no filesystem allowed)

const upload = {
    single: () => {
        return (req, res, next) => {
            req.file = null; // tidak ada file yang diproses
            next();
        };
    },
};

export default upload;
