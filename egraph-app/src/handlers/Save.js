import { get, set, del } from 'idb-keyval';
const bfsa = require("browser-fs-access")

const recentFileTag = ".current_file"

export function getRecentFile() {
    const file = JSON.parse(localStorage.getItem(recentFileTag)) || null;
    return file;
}

export function saveFileToLocalStorage(file_name) {
    const file = getRecentFile();
    // if (!(file?.name === file_name)) {
        
    // }
    localStorage.setItem(recentFileTag, JSON.stringify({ name: file_name }));
}

export function saveFileToIndexedDB(file_name, url){
    const file = getRecentFile();
}

export function getContentOfRecentFile() {
    return JSON.parse(localStorage.getItem(recentFileTag));
}

export const saveFile = async (blob, filename) => {
    try {
        const handle = await window.showSaveFilePicker({
            types: [{
                accept: {
                    "application/json": [".json", ".egraph"]
                },
            }],
            suggestedName: filename
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return handle;
    } catch (err) {
        console.error(err.name, err.message);
    }
};

export const openFile = async (mainpulate_blob) => {
    if(bfsa.supported){
        const file = await bfsa.fileOpen({
            extensions: [".json", ".egraph"],
            description: "JSON/EGraph files",
            startIn: "documents"
        }).then(
            async(handle) => {
                await set(recentFileTag, handle.handle);
                if(mainpulate_blob){
                    const file = await handle.handle?.getFile()
                    mainpulate_blob(await file.text())
                };
                saveFileToLocalStorage(handle.name)
            }
        ).catch((reson) => {
            console.log(reson);
        })
    }
};

export const onSaveFileAs = async (content, filename, after_close) => {
    const blob = new File([content], filename, { type: "application/json" });
    if(bfsa.supported){
        await bfsa.fileSave(blob, {
            fileName: filename || "untitled.egraph",
            extensions: [".json", ".egraph"],
            startIn: "documents",
            description: "JSON/EGraph files"
        }).then(
            async (handle) => {
                await set(recentFileTag, handle);

                if(after_close){after_close()};
                saveFileToLocalStorage(handle.name) // Скорее утечка памяти будет
                
            }
        ).catch((reson) => {
            console.log(reson);
        })
        
    }
  }

  // TODO: есть баг при котором обновления почему-то нет..
  // при этом этот баг появляется если закрыть и открыть снова страницу
export const checkIsHandleExist = async() => {
    const recentFileOrNull = getRecentFile();
    const fileHandleOrUndefined = await get(recentFileTag);
    if(fileHandleOrUndefined){
        // Если нет постоянного доступа то он не даст открыть файл, нужно будет
        // открывать снова
        if(true){
        const stateFile = fileHandleOrUndefined.getFile().then((res) => {
            return true;
        }).catch( async (err) => {
            console.log(err)
            await del(recentFileTag);
            return false;
        })
        return await stateFile;
    }
    }
    return false;
}

export const onEditCurrentFile = async (new_content) => {
    let current_file = getContentOfRecentFile();    
    const new_blob = new File([new_content], current_file.name, {type: "application/json"});
    const fileHandleOrUndefined = await get(recentFileTag);
    if(fileHandleOrUndefined){
        const tt = await verifyPermission(fileHandleOrUndefined);
        if(tt){
            await bfsa.fileSave(new_blob, 
                {fileName: fileHandleOrUndefined.name}, 
                fileHandleOrUndefined, true)
                .catch((err) => {console.log(err)});
        }
    }
}

export const verifyPermission = async (fileHandle) => {
    if((await fileHandle.requestPermission({mode: 'readwrite'})) === 'granted'){
        return true;
    }
    return false;
}

export const getContentOfLastFile = async() => {
    if(await checkIsHandleExist()){
        const fileHandle = await get(recentFileTag);
        const file = await fileHandle.getFile();
        const content = await file.text();
        return content;
    }
    
    return undefined;
}