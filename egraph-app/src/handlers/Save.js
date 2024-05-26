
const recentFileTag = "recentFile"

export function getRecentFile(){
    const file = JSON.parse(localStorage.getItem(recentFileTag)) || null;
    return file;
}

export function saveFileToLocalStorage(file_name, url){
    const file = getRecentFile();
    if(!(file?.name === file_name)){
        localStorage.setItem(recentFileTag, JSON.stringify({name: file_name, url: url}));
    }
}

export function getContentOfRecentFile(){
    if(localStorage.getItem(recentFileTag)){

    }
}