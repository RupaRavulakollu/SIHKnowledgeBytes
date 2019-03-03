import React, { Component } from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import InputBase from '@material-ui/core/InputBase'
import LinearProgress from '@material-ui/core/LinearProgress'
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import '../css/Editor.css'

import Save from '@material-ui/icons/Save'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
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
        margin: 0,
        right: 20,
        bottom: 20,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
    },
    fabMoveUp: {
        transform: 'translate3d(0, -70px, 0)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.easeOut,
        }),
    },
    fabMoveDown: {
        transform: 'translate3d(0, 0, 0)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp,
        }),
    },
})

class NewByte extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            title: '',
            initialContent: '<p>&nbsp;</p>',
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
            savedToServer: false,
            description: '',
            tags: '',
            descriptionDialog: false,
        }
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
            if (!this.state.savedToServer) {
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
        this.setState({
            savingDraft: true,
            initialContent: content,
        })
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
                .then((res) => {
                    this.setState({
                        title: res.data.title,
                        initialContent: res.data.content,
                        savedToServer: true,
                    })
                })
                .catch(err => {
                    console.log('Error saving draft: ', err)
                    this.callSnacky(err.response.data.error, true)
                })
                .finally(() => {
                    this.setState({
                        savingDraft: false,
                    })
                })
        }
    }

    publishDraft = () => {
        if (!this.state.savedToServer) {
            this.callSnacky("Please save before publishing", true)
        }
        else {
            var rtags = this.state.tags
            var tags = rtags.replace(/\s/g, '').split(',')
            this.setState({ isPublishing: true })
            axios.post('/api/drafts/publish', { id: this.state.id, description: this.state.description, tags: tags })
                .then(res => {
                    window.location = `/profile`
                })
                .catch(err => {
                    console.log("Error publishing draft: ", err)
                    this.callSnacky(err.response.data.error, true)
                })
                .finally(() => this.setState({ isPublishing: false }))
        }
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

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        })
    }

    openDescriptionDialog = () => {
        this.setState({
            descriptionDialog: true,
        })
    }

    closeDescriptionDialog = () => {
        this.setState({
            descriptionDialog: false,
        })
    }

    render() {
        const { classes } = this.props
        const fabClassName = classNames(classes.fab, this.state.snackyOpen ? classes.fabMoveUp : classes.fabMoveDown);
        return (
            <div>
                {this.state.id ?
                    <div className={classes.ckContainer}>
                        <InputBase fullWidth multiline
                            className={classes.title}
                            value={this.state.title}
                            placeholder={"Byte Title"}
                            onChange={event => {
                                this.setState({
                                    savedToServer: false,
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
                                if (this.state.savedToServer) {
                                    this.setState({
                                        savedToServer: false,
                                    })
                                }
                            }}
                            disabled={this.state.savingDraft}
                        />
                        <div className={fabClassName}>
                            <Fab onClick={() => {
                                window.location = '/drafts'
                            }}
                                style={{ margin: "8px 0", }}
                            >
                                <ChevronLeft />
                            </Fab>
                            {!this.state.savedToServer ?
                                <Fab onClick={this.saveDraft} color='primary' style={{ margin: "8px 0", }}>
                                    <Save />
                                </Fab>
                                :
                                <Fab onClick={this.openDescriptionDialog} disabled={this.state.isPublishing} color='primary' style={{ margin: "8px 0", }}>
                                    <Publish />
                                </Fab>
                            }
                        </div>
                        {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                        <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                    </div>
                    :
                    <LinearProgress color='primary' />
                }
                <Dialog open={this.state.descriptionDialog} fullWidth>
                    <DialogTitle>{"Provide a description"}</DialogTitle>
                    <DialogContent style={{ paddingBottom: 5, }}>
                        <TextField
                            multiline
                            fullWidth
                            rows={4}
                            placeholder="Provide a description for your article for the readers to get a glimpse."
                            type="text"
                            margin="dense"
                            variant="outlined"
                            value={this.state.description}
                            onChange={this.handleChange('description')}
                        />
                    </DialogContent>
                    <DialogTitle>{"Attach Tags"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            multiline
                            fullWidth
                            rows={4}
                            placeholder="Provide a comma-separated list of tags for the readers to get a glimpse."
                            type="text"
                            margin="dense"
                            variant="outlined"
                            value={this.state.tags}
                            onChange={this.handleChange('tags')}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.closeDescriptionDialog}>{"Cancel"}</Button>
                        <Button color='primary' onClick={this.publishDraft}>{"Publish"}</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

export default withStyles(styles)(NewByte);