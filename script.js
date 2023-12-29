let chosenCategories = [];
let filters = [];
let blogs = [];
let blogCategories = [];
let blog = [];
var categories = document.querySelector('.categories');
var logInBtn = document.getElementById('log-in-btn');
var logInForm = document.querySelector('.log-in-form');
var closeBtn = document.getElementById('add');
var mailInput = document.getElementById('mail');
var categoryBtn = document.querySelector('.categories button');
var submitBtn = document.querySelector('.mail-input button');
var logInSuccess = document.querySelector('.log-in-success')
var logInInput = document.querySelector('.log-in-input')
var submitSuccessBtn = document.querySelector('.log-in-success button');
var errorText = document.querySelector('.error');
var logInBg = document.querySelector('.log-in-form-bg');
var newBlog = document.getElementById('create-blog');
var blogsContainer = document.querySelector('.blogs');
let chosenFilters = localStorage.getItem('chosenCategory');
var main = document.getElementById('main-page');
var blogPage = document.getElementById('blog-page');
var chosenBlog = document.getElementById('chosen-blog');
var splideList = document.querySelector(".splide__list");

if (chosenFilters && chosenFilters !== ''){
    chosenCategories = chosenFilters.split(',').map(str => +str)
}

var date = new Date();
console.log(date);

fetch('https://api.blog.redberryinternship.ge/api/blogs', {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': "Bearer 8f44816def3fea4a32456945a277e5f7e7044586f85d6aa2acb40edcad174894"
    }})
    .then(res => res.json())
    .then(data => {
        blogs = data.data;

        for (let i = 0; i < blogs.length; i++){
            var blog_date = new Date(blogs[i].publish_date);
            if (blog_date <= date){
                let blog = document.createElement('div');
                blog.id = blogs[i].id;
                blogsContainer.appendChild(blog);
                let blogImage = document.createElement('img');
                blogImage.src = blogs[i].image;
                let blogAuthor = document.createElement('h5');
                blogAuthor.innerText = blogs[i].author;
                let blogDate = document.createElement('span');
                blogDate.innerText = blogs[i].publish_date;
                let blogTitle = document.createElement('h3');
                blogTitle.innerText = blogs[i].title;
                blog.appendChild(blogImage);
                blog.appendChild(blogAuthor);
                blog.appendChild(blogDate);
                blog.appendChild(blogTitle);
                let blogFilterDiv = document.createElement('div');
                blog.appendChild(blogFilterDiv);
                let blogFilters = [];
                for (let index = 0; index < blogs[i].categories.length; index++){
                    blogFilters.push(blogs[i].categories[index].id)
                    let blogCategory = document.createElement('button')
                    blogCategory.innerText = blogs[i].categories[index].title;
                    blogCategory.value = blogs[i].categories[index].id;
                    blogCategory.style.backgroundColor = blogs[i].categories[index].background_color;
                    blogCategory.style.color = blogs[i].categories[index].text_color;
                    blogFilterDiv.appendChild(blogCategory);
                }
                for (let a = 0; a < chosenCategories.length; a++){
                    if (blogFilters.includes(chosenCategories[a])){
                        blog.removeAttribute('style');
                        break
                    } else {
                        blog.setAttribute('style', 'display: none')
                    }
                }
                let blogDescription = document.createElement('p');
                blogDescription.innerText = blogs[i].description;
                blog.appendChild(blogDescription);
                let blogLink = document.createElement('a');
                blogLink.className = 'blogLink';
                blogLink.href = `./blog_page.html?id=${blogs[i].id}`;
                blogLink.innerHTML = 'სრულად ნახვა  <img src="./images/link-arrow.svg">';
                blogLink.value = blogs[i].id;
                blog.appendChild(blogLink);
                blogCategories.push(blogFilters)
            }
        }
    })
    .catch(error => console.error('Error fetching data:', error));

fetch('https://api.blog.redberryinternship.ge/api/categories')
    .then(res => res.json())
    .then(data => {
        filters = data.data;

        console.log(filters);
        for (let index = 0; index < filters.length; index++) {
            let option = document.createElement("button");
            option.innerText = filters[index].title;
            option.value = filters[index].id;
            option.style.backgroundColor = filters[index].background_color;
            option.style.color = filters[index].text_color;
            categories.appendChild(option);
            if (chosenCategories.includes(filters[index].id)){
                option.style.border = '1px solid #000'
            }
            option.addEventListener('click', (e) => {
                e.preventDefault;
                if (chosenCategories.includes(filters[index].id)){
                    console.log(option.innerText + " clicked twice");
                    let optionIndex = chosenCategories.indexOf(filters[index].id);
                    chosenCategories.splice(optionIndex, 1);
                    console.log(chosenCategories);
                    option.style.border = 'none';
                } else {
                    chosenCategories.push(filters[index].id);
                    console.log(chosenCategories);
                    option.style.border = '1px solid #000'
                }
                localStorage.setItem('chosenCategory', chosenCategories);
                for (let i=0; i<blogCategories.length; i++){
                    let contains = blogCategories[i].some(element => {
                        return chosenCategories.includes(element)
                    })
                    var blog_date = new Date(blogs[i].publish_date);
                    let blogID = document.getElementById(blogs[i].id)
                    if (contains || chosenCategories.length === 0 && blog_date <= date){
                        blogID.removeAttribute('style');
                    } else {
                        blogID.setAttribute('style', 'display: none')
                    }
                }         
            })
        }
    })
    .catch(error => console.error('Error fetching data:', error));

console.log(blogCategories);

logInBtn.addEventListener('click', () => {
    logInForm.removeAttribute('style');
    logInBg.removeAttribute('style');
})

closeBtn.addEventListener('click', () => {
    logInForm.setAttribute('style', 'display: none')
    logInBg.setAttribute('style', 'display: none')
})

submitSuccessBtn.addEventListener('click', () => {
    logInForm.setAttribute('style', 'display: none')
    logInBg.setAttribute('style', 'display: none')
})

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(mailInput.value)
    let formData = new FormData();
    formData.append('email', mailInput.value)

    fetch('https://api.blog.redberryinternship.ge/api/login', {
    method: "POST",
    headers: {
        'accept': 'application/json',
    },
    body: formData
    }).then(res => {
        if (res.status == 204) {
            logInSuccess.removeAttribute('style');
            logInInput.setAttribute('style', 'display: none');
            logInBtn.setAttribute('style', 'display: none');
            newBlog.removeAttribute('style');
        } else {
            errorText.removeAttribute('style');
            submitBtn.removeAttribute('style');
        }
        return res.status;
        })
        .then(data => {
            console.log(data);
            if (data == 204) {
                localStorage.setItem('isLoggedIn', true)
            }
        })
        .catch(error => console.error('Error:', error));
})
