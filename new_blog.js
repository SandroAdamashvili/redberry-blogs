let storedCategories = []
let categories = [];
let chosenCategories = [];
let filters = [];
let select = document.getElementById("select-filter");
var form = document.getElementById("form");
var author = document.getElementById("name")
var title = document.getElementById("title");
var description = document.getElementById("description");
var date = document.getElementById("date");
var mail = document.getElementById("mail");
var minSymbols1 = document.getElementById("min-4-1");
var minSymbols2 = document.getElementById("min-4-2");
var minSymbols3 = document.getElementById("min-4-3");
var minWords = document.getElementById("min-2");
var lang = document.getElementById("lang");
var profileImage = document.getElementById("myFile");
var errorMessage = document.getElementById("error");
var postButton = document.getElementById("post");
var uploadeImage = document.querySelector(".file-upload");
var uploadText = document.getElementById("file-name");
var closeBtn = document.getElementById("add");
var backPage = document.querySelector('.back-page');
var closePageBtn = document.getElementById('close');
var successBg = document.querySelector('.success-bg');
var successForm = document.querySelector('.success-form');
let selectedValue;
let file;

if (localStorage.getItem('isLoggedIn') !== 'true'){
    alert('დალოგინებული არ ხარ!');
    window.location.replace('./index.html')
}

fetch('https://api.blog.redberryinternship.ge/api/categories')
    .then(res => res.json())
    .then(data => {
        filters = data.data;

        for (let index = 0; index < filters.length; index++) {
            let option = document.createElement("option");
            option.text = filters[index].title;
            option.value = filters[index].id;
            option.style.backgroundColor = filters[index].background_color;
            option.setAttribute('style', 'background-color: ' + filters[index].background_color)
            option.style.color = filters[index].text_color;
            option.setAttribute('style', 'color: ' + filters[index].text_color)
            select.appendChild(option);
        }

        
        new MultiSelectTag('select-filter', {
            onChange: function(values){
                categories = values;
                console.log(categories);
                storedCategories = [];
                categories.forEach(category => {                    
                    storedCategories.push(category.value)
                })
                localStorage.setItem('selectValue', storedCategories)
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));

author.value = localStorage.getItem("authorValue")
title.value = localStorage.getItem("titleValue")
description.value = localStorage.getItem("descriptionValue")
date.value = localStorage.getItem("dateValue")
mail.value = localStorage.getItem("mailValue")
file = localStorage.getItem('imageValue')

author.addEventListener('keyup', displayForm)
title.addEventListener('keyup', displayForm)
description.addEventListener('keyup', displayForm)
date.addEventListener('input', displayForm)
mail.addEventListener('keyup', displayForm)

function displayForm() {
    
    localStorage.setItem('authorValue', author.value)
    localStorage.setItem('titleValue', title.value)
    localStorage.setItem('descriptionValue', description.value)
    localStorage.setItem('dateValue', date.value)
    localStorage.setItem('mailValue', mail.value)
}

form.addEventListener('submit', function(e){
    e.preventDefault();

    categories.forEach((category) => {
        chosenCategories.push(Number(category.value));
    })

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('image', file);
    formData.append('author', author.value);
    formData.append('publish_date', date.value);
    formData.append('categories', JSON.stringify(chosenCategories));
    formData.append('email', mail.value);
    console.log(formData);

    fetch('https://api.blog.redberryinternship.ge/api/blogs', {
    method: "POST",
    headers: {
        'accept': 'application/json',
        'Authorization': "Bearer 8f44816def3fea4a32456945a277e5f7e7044586f85d6aa2acb40edcad174894"
    },
    body: formData

    }).then(res => {
        console.log(res);
        return res
        })
        .then(data => {
            if (data.status == 204){
                successBg.removeAttribute('style');
                successForm.removeAttribute('style');
            }
        })
        .catch(error => console.log('Error:', error));

    localStorage.clear();
    author.value = null;
    title.value = null;
    description.value = null;
    date.value = null;
    select.value = null;
    mail.value = null;

})

form.addEventListener('input', (e)=>{
    if (author.value.length < 4 && author.value.length > 0 || author.value.includes('  ')){
        minSymbols1.setAttribute("style", "color: #EA1919")
        author.setAttribute("style", "border-color: #EA1919;")
    } else if(author.value.length >= 4){
        minSymbols1.setAttribute("style", "color: #14D81C")
        author.setAttribute("style", "border-color: #14D81C;")
    } 
    else {
        minSymbols1.setAttribute("style", "color: #85858D")
        author.setAttribute("style", "border-color: none;")
    }

    if (checkWhitespace(author.value)){
        minWords.setAttribute("style", "color: #14D81C")
    } else if (checkWhitespace(author.value) === false && author.value.length > 0){
        minWords.setAttribute("style", "color: #EA1919")
        author.setAttribute("style", "border-color: #EA1919;")
    }
    else {
        minWords.setAttribute("style", "color: #85858D")
        
    }

    if (isGeorgian(author.value)){
        lang.setAttribute("style", "color: #14D81C")
    } else if (isGeorgian(author.value) === false && author.value.length > 0){
        lang.setAttribute("style", "color: #EA1919")
        author.setAttribute("style", "border-color: #EA1919;")
    }
    else {
        lang.setAttribute("style", "color: #85858D")
    }

    if (title.value.length < 4 && title.value.length > 0){
        minSymbols2.setAttribute("style", "color: #EA1919")
        title.setAttribute("style", "border-color: #EA1919;")
    } else if(title.value.length >= 4){
        minSymbols2.setAttribute("style", "color: #14D81C")
        title.setAttribute("style", "border-color: #14D81C;")
    } 
    else {
        minSymbols2.setAttribute("style", "color: #85858D")
        title.setAttribute("style", "border-color: none;")
    }

    if (description.value.length < 4 && description.value.length > 0){
        minSymbols3.setAttribute("style", "color: #EA1919")
        description.setAttribute("style", "border-color: #EA1919;")
    } else if(description.value.length >= 4){
        minSymbols3.setAttribute("style", "color: #14D81C")
        description.setAttribute("style", "border-color: #14D81C;")
    } 
    else {
        minSymbols3.setAttribute("style", "color: #85858D")
        description.setAttribute("style", "border-color: none;")
    }

    if (isValidEmail(mail.value)){
        mail.setAttribute("style", "border-color: #14D81C;")
        errorMessage.innerHTML = ""
    } else if (isValidEmail(mail.value) === false && mail.value.length > 0){
        mail.setAttribute("style", "border-color: #EA1919;")
        errorMessage.innerHTML = "მეილი უნდა მთავრდებოდეს \"redberry.ge\"-ით"
    }
    else {
        mail.setAttribute("style", "border-color: none;")
        errorMessage.innerHTML = ""
    }

    if (description.value.length >= 4 && title.value.length >= 4 && isGeorgian(author.value) && 
    checkWhitespace(author.value) && author.value.length >= 4 && date.value !== '' && localStorage.getItem('image') !== null){
        if (isValidEmail(mail.value) === false && mail.value.length > 0){
            postButton.setAttribute('disabled', 'true')
            postButton.removeAttribute('style')
        } else {
            postButton.removeAttribute('disabled')
            postButton.setAttribute('style', 'background: #5D37F3')
            postButton.addEventListener('mouseover', () => {
                postButton.style.cursor = 'pointer';
            })
        }
        
    } 
    else {
        postButton.setAttribute('disabled', 'true')
        postButton.removeAttribute('style')
        postButton.addEventListener('mouseover', () => {
            postButton.style.cursor = 'default';
        })
    }
    
})

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}

if (localStorage.getItem('image') === null){
    document.querySelector(".choose-image").removeAttribute('style');
    uploadeImage.setAttribute('style', 'display: none')
    file = null;
    uploadText.innerText = ''
    profileImage.addEventListener('change', (e)=>{
        console.log("event: ", e);
        console.log("current target: ", e.target);
        const fileInput = e.target;
        file = fileInput.files[0];
        const reader = new FileReader();
        console.log(file)
        reader.addEventListener('load', () => {
            localStorage.setItem('image', reader.result);
          });
        if (file) {
            reader.readAsDataURL(file);
        }
        localStorage.setItem('uploadText', file.name)
        document.querySelector(".choose-image").setAttribute('style', 'display: none');
        uploadeImage.removeAttribute('style')
        uploadText.innerText = file.name;
    })
} else {
    document.querySelector(".choose-image").setAttribute('style', 'display: none');
    uploadeImage.removeAttribute('style')
    uploadText.innerText = localStorage.getItem('uploadText');
    file = dataURItoBlob(localStorage.getItem("image"));
    closeBtn.addEventListener('click', () => {
        document.querySelector(".choose-image").removeAttribute('style');
        uploadeImage.setAttribute('style', 'display: none')
        file = null;
        uploadText.innerText = ''
        console.log(file);
        console.log(uploadText.innerText);
        localStorage.removeItem('imageValue');
        localStorage.removeItem('uploadText');
    })
}

profileImage.addEventListener('change', (e)=>{
    console.log("event: ", e);
    console.log("current target: ", e.target);
    const fileInput = e.target;
    file = fileInput.files[0];
    const reader = new FileReader();
    console.log(file)
    reader.addEventListener('load', () => {
        localStorage.setItem('image', reader.result);
      });
    if (file) {
        reader.readAsDataURL(file);
    }
    localStorage.setItem('uploadText', file.name)
    document.querySelector(".choose-image").setAttribute('style', 'display: none');
    uploadeImage.removeAttribute('style')
    uploadText.innerText = file.name;
    closeBtn.addEventListener('click', () => {
        document.querySelector(".choose-image").removeAttribute('style');
        uploadeImage.setAttribute('style', 'display: none')
        file = null;
        uploadText.innerText = ''
        console.log(file);
        console.log(uploadText.innerText);
        localStorage.removeItem('imageValue');
    })
})

function checkWhitespace(str) { 
    return /\s/.test(str); 
} 

function isGeorgian(inputStr) {
    // Georgian script Unicode range: U+10D0 to U+10FF
    const georgianPattern = /^[\u10D0-\u10FF\s]+$/;
    return georgianPattern.test(inputStr);
}

function isValidEmail(inputStr) {
    // Ensure the input ends with "@redberry.ge"
    const emailPattern = /^[^\s@]+@redberry\.ge$/;
    return emailPattern.test(inputStr);
}

backPage.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
})

closePageBtn.addEventListener('click', () => {
    window.location.replace('./index.html');
})