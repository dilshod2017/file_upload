$(document).ready(()=>{
    
    const form = $(".form");
    const div_out = $(".div-out");
    // var c = div_out.data("count");
    var c = div_out.prop("id");
    var count = parseInt(c,10);
    let div = document.createElement('div');
    div.setAttribute("class", "div");
    let textarea = document.createElement("textarea");
    textarea.setAttribute("cols", 10);
    textarea.setAttribute("rows", 5);
    let link_rem_text = document.createElement("a");
    link_rem_text.setAttribute("class", "remove-text btn");
    let link_rem_file = document.createElement("a");
    link_rem_file.setAttribute("class", "remove-file btn");
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("id", `file`);
    let img = document.createElement("img");
    img.setAttribute("class","image-preview");
    img.setAttribute("alt","image-preview");
    link_rem_file.innerHTML = "remove file";
    link_rem_text.innerHTML = "remove text";
    
    $(".add-btn").click(()=>{
        ++count;
        textarea.setAttribute("class", `content_${count}`);
        textarea.setAttribute("name", `content_${count}`);
        input.setAttribute("class", `photo_${count}`);
        input.setAttribute("name", `photo_${count}`);
        div_out.append(div);
        div.append(textarea);
        div.append(link_rem_text);
        div.append(input);
        div.append(img);
        div.append(link_rem_file);
        div_out.prop("id", count);
    });
    
    div_out.on('click','a.remove-text',()=>{
        var parent = $("a.remove-text").parent();
        // console.log(parent);
        parent.find("textarea").remove();
        parent.find("a.remove-text").remove();  
        check_empty(parent);      
    })
    
    div_out.on('click','a.remove-file',()=>{
        var parent = $("a.remove-file").parent();
        // console.log(parent);
        parent.find("input").remove();
        parent.find('img').remove();
        parent.find("a.remove-file").remove();  
        check_empty(parent);      
    });
    // $("input").change((e)=>{
    //     let i = e.currentTarget.attributes.class.value;
    //     let self = $(`.${i}`);
    //     readURL(e.currentTarget, self);        
        
    // });
    
    div_out.on("change", "input",(e)=>{
        let i = e.currentTarget.attributes.class.value;
        let self = $(`.${i}`);
        readURL(e.currentTarget, self);        
    });
    
    $("#form").submit((event)=>{
        event.preventDefault();
        var payload = new FormData();
        var input = $("input");
        var textarea = $("textarea");
        $.each(input,(index, value)=>{
            payload.append("img", value.files[0]);
        });

        $.each(textarea, (index, val)=>{
            payload.append(`${val.name}`, val.value);
        })
        payload.append("count", count);
        $.ajax({
            url: '/test',
            type: 'post',
            data: payload,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log("data");
                // location.reload();
            }
        });
      
    })
});//end of document ready-----------------------------------------------

const check_empty = (element)=>{
    if(element.is(":empty")){
        element.remove();
    }
}

function readURL(input, self) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
           self.after(`<img src="${e.target.result}" with="350px" height="200px"/>`);
        }
        reader.readAsDataURL(input.files[0]);
    } 
}
