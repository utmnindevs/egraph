
const recentFileTag = "recentFile"

export function getRecentFile() {
    const file = JSON.parse(localStorage.getItem(recentFileTag)) || null;
    return file;
}

export function saveFileToLocalStorage(file_name, url) {
    const file = getRecentFile();
    if (!(file?.name === file_name)) {
        localStorage.setItem(recentFileTag, JSON.stringify({ name: file_name, url: url }));
    }
}

export function getContentOfRecentFile() {
    if (localStorage.getItem(recentFileTag)) {

    }
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

export const onSaveFileAs = (content, filename, after_close) => {
    const blob = new Blob([content], { type: "application/json" });
    saveFile(blob, filename || "test.egraph").then(
      (value) => {
        console.log(value.name);
        if(after_close){after_close()};
        saveFileToLocalStorage(value.name, URL.createObjectURL(blob));
      }
    ).catch((reson) => {
      console.log(reson)
    })
  }