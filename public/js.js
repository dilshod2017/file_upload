$(document).ready(()=>{
    let root = $(".root");
    $.get("/done",(data)=>{
        // console.log(data);
        
        if(!data.map){
            return console.log("error");
        } 
        let map;
        let text;
        let head;
        let img;
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
        if(data.image && data.image.length > 0)
            img = data.image;
            


        // console.log("map",map);
        // console.log("text",text);
        // console.log("head",head);
        // console.log("img", data.image);
        // img.forEach(element => {
        //     let image = document.createElement("img");
        //     image.setAttribute("src", element[1]);
        //     $(".root").append(image);
        // }); 
        let text_i = -1;
        let head_i = -1;
        let img_i = -1;
        // console.log(img);
        
        for(let i = 0; i < map.length;++i){
            // console.log(map[i]);
            if(map[i].includes("text")){
                if(++text_i < text.length){
                    // console.log("text_temp", text[text_i][1]);
                    let p = document.createElement("p");
                    p.innerHTML = text[text_i][1];
                    root.append(p);
                }
            } else if (map[i].includes("head")){
                if (++head_i < head.length) {
                    // console.log("head_temp", head[head_i][1]);
                    let h1 = document.createElement("h1");
                    h1.innerHTML = head[head_i][1];
                    root.append(h1)
                }
            } else if(map[i].includes("file")){
                if(++img_i < img.length){
                    // console.log("img_loop", img[img_i]);
                    let image = document.createElement("img");
                    image.setAttribute("src",img[img_i][1]);
                    root.append(image)
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