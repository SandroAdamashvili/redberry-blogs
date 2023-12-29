var chosenBlog = document.getElementById('chosen-blog');
var splideList = document.querySelector(".splide__list");
var logInBtn = document.getElementById('log-in-btn');
var logInForm = document.querySelector('.log-in-form');
var closeBtn = document.getElementById('add');
var mailInput = document.getElementById('mail');
var submitBtn = document.querySelector('.mail-input button');
var logInSuccess = document.querySelector('.log-in-success')
var logInInput = document.querySelector('.log-in-input')
var submitSuccessBtn = document.querySelector('.log-in-success button');
var errorText = document.querySelector('.error');
var logInBg = document.querySelector('.log-in-form-bg');
var newBlog = document.getElementById('create-blog');
const searchParams = new URLSearchParams(window.location.search);
console.log(searchParams.get('id'));

fetch('https://api.blog.redberryinternship.ge/api/blogs/' + searchParams.get('id'), {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': "Bearer 8f44816def3fea4a32456945a277e5f7e7044586f85d6aa2acb40edcad174894"
                    }
                })
                .then(res => res.json())
                .then(data => {
                    blog = data;
                    console.log(blog);

                    let chosenBlogImage = document.createElement('img');
                    chosenBlogImage.src = blog.image;
                    chosenBlog.appendChild(chosenBlogImage);
                    let chosenBlogInfo = document.createElement('div');
                    chosenBlog.appendChild(chosenBlogInfo);
                    let chosenBlogAuthor = document.createElement('h4');
                    chosenBlogAuthor.innerText = blog.author;
                    chosenBlogInfo.appendChild(chosenBlogAuthor);
                    let dashToDot = blog.publish_date.split('-');
                    let chosenBlogDate = dashToDot.reverse().join('.');
                    let chosenBlogMail = blog.email;
                    let dateAndMail = document.createElement('span');
                    dateAndMail.innerHTML = chosenBlogDate + ' • ' + chosenBlogMail;
                    chosenBlogInfo.appendChild(dateAndMail);
                    let chosenBlogTitle = document.createElement('h2');
                    chosenBlogTitle.innerText = blog.title;
                    chosenBlogInfo.appendChild(chosenBlogTitle);
                    let chosenBlogFilters = document.createElement('div');
                    chosenBlogInfo.appendChild(chosenBlogFilters);
                    let chosenBlogCategories = [];
                    for (let i=0; i<blog.categories.length; i++){
                        chosenBlogCategories.push(blog.categories[i].id);
                        let chosenBlogFilter = document.createElement('button');
                        chosenBlogFilter.innerText = blog.categories[i].title;
                        chosenBlogFilter.style.backgroundColor = blog.categories[i].background_color;
                        chosenBlogFilter.style.color = blog.categories[i].text_color;
                        chosenBlogFilters.appendChild(chosenBlogFilter);
                    }
                    let chosenBlogDesc = document.createElement('p');
                    chosenBlogDesc.innerText = blog.description;
                    chosenBlogInfo.appendChild(chosenBlogDesc);
                    fetch('https://api.blog.redberryinternship.ge/api/blogs', {
                        method: 'GET',
                        headers: {
                            'accept': 'application/json',
                            'Authorization': "Bearer 8f44816def3fea4a32456945a277e5f7e7044586f85d6aa2acb40edcad174894"
                        }})
                        .then(res => res.json())
                        .then(data => {
                            blogs = data.data;
                            console.log(blogs);

                            blogs.forEach((item) => {
                        
                                for (let i=0; i<item.categories.length; i++){
                                    if (chosenBlogCategories.includes(item.categories[i].id) && item.id !== blog.id){
                                        let splideSlide = document.createElement('div')
                                        splideSlide.className = 'splide__slide';
                                        splideList.appendChild(splideSlide);
                                        let similarBlog = document.createElement('div')
                                        similarBlog.className = 'similar-blog';
                                        splideSlide.appendChild(similarBlog);
                                        let similarBlogImage = document.createElement('img');
                                        similarBlogImage.src = item.image;
                                        similarBlog.appendChild(similarBlogImage);
                                        let similarBlogAuthor = document.createElement('h5');
                                        similarBlogAuthor.innerText = item.author;
                                        similarBlog.appendChild(similarBlogAuthor);
                                        let similarBlogDate = document.createElement('span');
                                        similarBlogDate.innerText = item.publish_date.split('-').reverse().join('.');
                                        similarBlog.appendChild(similarBlogDate);
                                        let similarBlogTitle = document.createElement('h3');
                                        similarBlogTitle.innerText = item.title;
                                        similarBlog.appendChild(similarBlogTitle);
                                        let similarBlogCategories = document.createElement('div');
                                        similarBlogCategories.className = 'similar-blog-categories';
                                        similarBlog.appendChild(similarBlogCategories);
                                        let similarCategories = [];
                                        for (let index=0; index<item.categories.length; index++){
                                            similarCategories.push(item.categories[index].id);
                                            let similarBlogFilter = document.createElement('button');
                                            similarBlogFilter.innerText = item.categories[index].title;
                                            similarBlogFilter.style.backgroundColor = item.categories[index].background_color;
                                            similarBlogFilter.style.color = item.categories[index].text_color;
                                            similarBlogCategories.appendChild(similarBlogFilter);
                                        }
                                        let similarBlogDesc = document.createElement('p');
                                        similarBlogDesc.innerText = item.description;
                                        similarBlog.appendChild(similarBlogDesc);
                                        let similarBlogLink = document.createElement('a');
                                        similarBlogLink.className = 'blogLink';
                                        console.log('blogs: ', i, item.id);
                                        similarBlogLink.href = `blog_page.html?id=${item.id}`;
                                        similarBlogLink.innerHTML = 'სრულად ნახვა  <img src="./images/link-arrow.svg">';
                                        similarBlogLink.value = blogs[i].id;
                                        similarBlog.appendChild(similarBlogLink);
                                        break;
                                    }
                                }
                            })
                        })
                        .then(() => {
                            var splide = new Splide( '.splide', {
                                perPage: 3,
                                focus  : 0,
                                } );
                            
                                splide.mount();
                        })
                })
                

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
            if (data == 204) {
                localStorage.setItem('isLoggedIn', true)
            }
        })
        .catch(error => console.error('Error:', error));
})
