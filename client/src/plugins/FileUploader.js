import axios from 'axios'

class FileUploader {
    constructor(loader, draftId) {
        this.loader = loader
        this.draftId = draftId
        this.source = axios.CancelToken.source();
        console.log("Gotya", this.draftId)
    }

    upload() {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append('id', this.draftId)
            data.append('file', this.loader.file);
            axios.put('/api/drafts/file', data, {cancelToken: this.source.token})
            .then(res => {
                resolve({default: res.data.url})      
            })
            .catch(err => {
                if (axios.isCancel(err)) reject(err.message ? err.message : "Something's Wrong")
                else reject(err.response.data.error ? err.response.data.error : "Something's Wrong")
            })
        })
    }

    abort() {
        this.source.cancel("Upload Cancelled")
    }
}

export default FileUploader