import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import InputBase from '@material-ui/core/InputBase'
import LinearProgress from '@material-ui/core/LinearProgress'
import '../css/Editor.css'

import Save from '@material-ui/icons/Save'
import Delete from '@material-ui/icons/Delete'
import Publish from '@material-ui/icons/Publish'

import axios from 'axios'
import Snacky from '../components/Snacky'
import FileUploader from '../plugins/FileUploader'

const styles = theme => ({
    ckContainer: {
        paddingBottom: 36
    },
    title: {
        borderRadius: 16,
        fontSize: 40,
        paddingLeft: 8,
        margin: "24px 0",
    },
    fab: {
        position: 'fixed',
        right: 10,
        bottom: 10,
    },
    fab2: {
        position: 'fixed',
        right: 10,
        bottom: 80,
    },
    fab3: {
        position: 'fixed',
        right: 10,
        bottom: 150,
    },
})

class NewByte extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            title: '',
            initialContent: '<p>&nbsp;</p>',
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
        }
        this.savedToServer = false
    }

    componentDidMount() {
        const paths = window.location.pathname.split('/')
        const id = paths[paths.length - 1]
        axios.get(`/api/drafts/${id}`)
            .then(res => {
                if (res.data.id) {
                    this.setState({
                        id: res.data.id,
                        title: res.data.title,
                        initialContent: res.data.content,
                    })
                }
                else {
                    window.location = '/new-byte'
                }
            })
            .catch(err => {
                console.log("Error creating draft: ", err)
                this.callSnacky(err.response.data.error, true)
            })
        //Listen for unload
        window.addEventListener('beforeunload', event => {
            event.preventDefault()
            if (!this.savedToServer) {
                event.returnValue = "You have unsaved changes. Do you want to leave this page and discard your changes or stay on this page?"
                return "You have unsaved changes. Do you want to leave this page and discard your changes or stay on this page?"
            }
            else return undefined
        })
    }

    uploadFilePlugin = (editor) => {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            console.log(loader, this.state.id)
            return new FileUploader(loader, this.state.id);
        };
    }

    saveDraft = () => {
        var content = this.editor.getData()
        console.log(content)
        if (!this.state.title) {
            this.callSnacky("Please enter a title to save the draft", true)
        }
        else {
            var body = {
                id: this.state.id,
                content: content,
                title: this.state.title
            }
            console.log(body)
            axios.put('/api/drafts', body)
                .then(() => {
                    this.savedToServer = true
                    this.callSnacky("Saved")
                })
                .catch(err => {
                    console.log('Error saving draft: ', err)
                    this.callSnacky(err.response.data.error, true)
                })
        }
    }

    publishDraft = () => {
        if (!this.savedToServer) {
            this.callSnacky("Please save before publishing", true)
        }
        else {
            axios.post('/api/drafts/publish', { id: this.state.id })
                .then(res => {
                    window.location = `/byte/${res.data.id}`
                })
                .catch(err => {
                    console.log("Error publishing draft: ", err)
                    this.callSnacky(err.response.data.error, true)
                })
        }
    }

    deleteDraft = () => {
        axios.delete(`/api/drafts/${this.state.id}`)
            .then(_ => console.log("Deleted draft"))
            .catch(err => console.log("Error deleting draft: ", err))
    }

    callSnacky = (message, isError) => {
        if (isError && !message) {
            message = "Something's Wrong"
        }
        this.setState({
            snackyMessage: message,
            snackyOpen: true,
            snackyErrorType: isError,
        })
    }

    handleSnackyClose = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ snackyOpen: false });
    };

    render() {
        const { classes } = this.props
        return (
            <div>
                {this.state.id ?
                    <div className={classes.ckContainer}>
                        <InputBase fullWidth multiline
                            className={classes.title}
                            value={this.state.title}
                            placeholder={"Byte Title"}
                            onChange={event => {
                                this.savedToServer = false
                                this.setState({
                                    title: event.target.value,
                                })
                            }}
                        />
                        <CKEditor
                            editor={ClassicEditor}
                            config={{ extraPlugins: [this.uploadFilePlugin] }}
                            data={this.state.initialContent}
                            onInit={editor => {
                                this.editor = editor
                                console.log('Editor is ready to use!', editor, this.editor);
                            }}
                            onChange={() => {
                                this.savedToServer = false
                            }}
                        />
                        <Fab onClick={this.saveDraft} color='primary' className={classes.fab}>
                            <Save />
                        </Fab>
                        <Fab onClick={this.publishDraft} color='primary' className={classes.fab2}>
                            <Publish />
                        </Fab>
                        <Fab onClick={() => {
                            this.deleteDraft()
                            window.location = '/'
                        }}
                            className={classes.fab3}
                        >
                            <Delete />
                        </Fab>
                        {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                        <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                    </div>
                    :
                    <LinearProgress color='primary' />
                }
            </div>
        )
    }

}

export default withStyles(styles)(NewByte);