
const storage = {
    update : (key,value) => {
        localStorage.setItem(key,JSON.stringify([...value]));
    },
    get : (key) => {
        const value = localStorage.getItem(key);
        if(value){
            return JSON.parse(value);
        }
        else {
            return null;
        }
    }
}

export default storage;