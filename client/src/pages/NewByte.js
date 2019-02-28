import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import InputBase from '@material-ui/core/InputBase'
import '../css/Editor.css'

import Save from '@material-ui/icons/Save'

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
    }
})

class NewByte extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
        }
    }

    saveDraft = () => {
        console.log(this.editor.getData())
        //Send to server
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.ckContainer}>
                <InputBase fullWidth multiline
                    className={classes.title}
                    value={this.state.title}
                    placeholder={"Byte Title"}
                    onChange={event => {
                        this.setState({
                            title: event.target.value,
                        })
                    }}
                />
                <CKEditor
                    editor={ClassicEditor}
                    data="<p></p>"
                    onInit={editor => {
                        this.editor = editor
                        console.log('Editor is ready to use!', editor, this.editor);
                    }}
                />
                <Fab onClick={this.saveDraft} color='primary' className={classes.fab}>
                    <Save />
                </Fab>
            </div>
        )
    }

}

export default withStyles(styles)(NewByte);