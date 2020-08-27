module.exports = {
    SERV_PORT: '3000',
    MONGODB_URI: `mongodb+srv://alexey:LyW3ShZ555R9bnMI@cluster0.mfycr.mongodb.net/db_shop?retryWrites=true&w=majority`,
    SESSION_SECRET: 'some secret value',
    SENDGRID_API_KEY: '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',
    EMAIL_FROM: 'voloshinalex1100@gmail.com',
    get BASE_URL() {
        return `http://localhost:${this.SERV_PORT}`
    }
}