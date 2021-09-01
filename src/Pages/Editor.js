import React , {useState} from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-kotlin';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-solarized_light';

function Editor(props) {
                       
    const {theme, language, width, height, body, setBody, readOnly, fontSize} = props;

    return (
        <div>
            <AceEditor
                mode={language}
                theme={theme}
                onChange={(value) => setBody(value)}
                value={body}
                width={width ? width : '100%'}
                height={height ? height : '80vh'}
                readOnly={readOnly ? readOnly : false}
                fontSize={fontSize ? (isNaN(+fontSize) ? 12 : +fontSize) : 12}
                name="UNIQUE_ID_OF_DIV"
                showGutter={true}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                }}
            />
        </div>
    );
};

export default Editor;
