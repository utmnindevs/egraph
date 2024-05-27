const bfsa = require("browser-fs-access")

const recentFileTag = ".current_file"

export function getRecentFile() {
    const file = JSON.parse(localStorage.getItem(recentFileTag)) || null;
    return file;
}

export function saveFileToLocalStorage(file_name, url) {
    const file = getRecentFile();
    // if (!(file?.name === file_name)) {
        
    // }
    localStorage.setItem(recentFileTag, JSON.stringify({ name: file_name, url: url }));
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

export const openFile = async () => {
    try {
        const [handle] = await window.showOpenFilePicker();
        return handle.getFile();
    } catch (err) {
        console.error(err.name, err.message);
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
                if(after_close){after_close()};
                console.log(JSON.stringify(handle.getFile()))
                saveFileToLocalStorage(handle.name, URL.createObjectURL(blob)) // Скорее утечка памяти будет
                const new_blob = new File(["test"], handle.name, {type: "application/json"});
                await bfsa.saveFile(new_blob, undefined, handle, true);
            }
        ).catch((reson) => {
            console.log(reson);
        })
        
    }
  }

  /*
    Временное сохранение, получение контента из недавнего файла.  
  let file = await fetch(current_file.url)
        .then((res) => res.blob())
        .then((blob) => new File([blob], current_file.name, {type: "application/json"}))

  */

export const onEditCurrentFile = async (new_content) => {
    // раз будет перезапись а не добавление, то справедливости ради, блоб даже не нужен, нам нужен путь куда
    // перезаписать файл и всё.
    let current_file = getContentOfRecentFile();    
    const new_blob = new File([new_content], current_file.name, {type: "application/json"});
    let file = await fetch(current_file.url)
        .then((res) => res.blob())
        .then((blob) => new Blob([blob], {type: "application/json"}))
    
    await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText()
    })


    // await bfsa.fileSave(file)
    console.log(file.text().then((val) => console.log(val)))
}