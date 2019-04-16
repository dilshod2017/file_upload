$(document).ready(()=>{
    let root = $(".root");
    $.get("/done",(data)=>{
        // console.log(data);
        
        if(!data.map){
            return console.log("error");
        } 
        let map
        let text
        let head
        let img
        let title = document.createElement("h1");
        title.innerHTML = data.title;
        root.append(title);
        // let map_length = data.map.length;
        if(data.map && data.map.length >0 )
            map = data.map;
        if(data.text && data.text.length > 0)
            text = data.text;
        if(data.head && data.head.length > 0)
            head = data.head;
        if(data.responce && data.responce.length > 0)
            img = data.responce;


        console.log("map",map);
        console.log("text",text);
        // console.log("head",head);
        // console.log("img",img);
        // img.forEach(element => {
        //     let image = document.createElement("img");
        //     image.setAttribute("src", element);
        //     $(".root").append(image);
        // }); 
        for(let i = 0; i < map.length;++i){
            console.log(map[i]);
            if(map[i].includes("text")){
                for(let text_i = 0; text_i < text.length; text_i++){
                    if(map[i] === text[text_i][0]){
                        let text_temp = [];
                        text_temp = text.filter(item=> item !== text[text_i]);
                        text = [...text_temp];
                        // console.log("text_temp", text_temp);
                    }
                }
            } else if (map[i].includes("head")){
                for (let head_i = 0; head_i < head.length; head_i++) {
                    if (map[i] === head[head_i][0]) {
                        let head_temp = [];
                        head_temp = head.filter(item => item[0] !== head[head_i][0]);
                        head = [...head_temp];
                        // console.log("head_temp", head_temp);
                    }
                }
            } else if(map[i].includes("file")){
                console.log(img);
                
                for (let img_i = 0; img_i < img.length; img_i++) {
                    // if (map[i] === img[img_i][0]) {                      
                    //     let img_temp = [];
                    //     img_temp = img.filter(item => item !== img[img_i]);
                    //     img = [...img_temp];
                    //     console.log("img_temp", img_temp);
                    // }
                }
            }
        }
    })
});

const head_print = (array_item, index)=>{
    let size = array_item;
    if(index < size) {
        console.log(array_item[index]);        
    }index++;
}