$(document).ready(()=>{
    let root = $(".root");
    $.get("/done",(data)=>{
        console.log(data);
        
        if(!data.map){
            return console.log("error");
        } 
        let title = document.createElement("h1");
        title.innerHTML = data.title;
        root.append(title);
        let map_length = data.map.length;
        let map = data.map;
        let text = data.text;
        let head = data.head;
        let img = data.responce;
        let text_i = 0,
            head_i = 0;
        // console.log("map",map);
        console.log("text",text);
        // console.log("head",head);
        // console.log("img",img);
        img.forEach(element => {
            let image = document.createElement("img");
            image.setAttribute("src", element);
            $(".root").append(image);
        });       
        console.log("head",head);
        
        map.forEach((item)=>{
            if(item === text[text_i][0] && text_i < text.length-1){
                console.log("item");
                ++text_i;
            } else if (item === head[head_i] && head_i < head.length-1){
                console.log("head");
                ++head_i;                
            } else {
                console.log("none");
            }
            
        })
    })
});