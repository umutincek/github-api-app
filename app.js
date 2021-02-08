class Request {
    getUser(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        })
    };

    getFollowers(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        })
    };

    getFollowing(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        })
    };

    getRepositories(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        })
    };
}

const request = new Request();

const form = document.querySelector("#form1");
const searchUser = document.querySelector("#searchUser");
const profileTitle = document.querySelectorAll(".profile-title");
const profiles = document.querySelectorAll(".profiles");
const repositories = document.querySelector(".repositories");
const userProfile = document.querySelector(".user-profile");
const profilePhoto = document.querySelector(".profile-photo");
const profileInfo = document.querySelector(".profile-info");

function eventListener(){
    form.addEventListener("submit", function(e) {
        profilePhoto.innerHTML = "";
        profileInfo.innerHTML = "";
        request.getUser(`https://api.github.com/users/${searchUser.value}`)
            .then(data => {
                profiles.forEach(p => p.innerHTML = "");
                repositories.innerHTML = "";
                if(data.login) {
                    userProfileHtml({
                        imageUrl: data.avatar_url,
                        infos: [
                            data.public_repos,
                            data.followers,
                            data.following,
                        ]
                    });
                    profileTitle.forEach(p => p.classList.remove("d-none"));
                    return {
                        followersUrl: data.followers_url,
                        followingUrl: `https://api.github.com/users/${data.login}/following`,
                        reposUrl: data.repos_url,
                    }
                } else {
                    profileTitle.forEach(p => {
                        if(!p.classList.contains("d-none")) {
                            p.classList.add("d-none");
                        }
                    });
                    alert("Böyle bir kullanıcı adı bulunmamaktadır!");
                    return false;
                }
            })
            .then(url => {
                if(url) {
                    request.getFollowers(url.followersUrl)
                        .then(data => {
                            data.map(d => profileHtml(d.avatar_url, d.login, d.html_url, 0));
                        })
                        .catch(err => console.log(err));
                    request.getFollowing(url.followingUrl)
                        .then(data => {
                            data.map(d => profileHtml(d.avatar_url, d.login, d.html_url, 1));
                        })
                        .catch(err => console.log(err));
                    request.getRepositories(url.reposUrl)
                        .then(data => {
                            data.map(d => reposHtml(d.full_name, d.html_url, d.description, d.language));
                        })
                        .catch(err => console.log(err));
                    }
            }) 
            .catch(err => console.log(err));

        e.preventDefault();
    });
}

eventListener();

function userProfileHtml(profileData) {
    const userTitle = ["repositories", "followers", "following"];
    const photo = document.createElement("img");
    photo.src = profileData.imageUrl;
    photo.className = "radius-50";
    profilePhoto.appendChild(photo);

    for(let i = 0; i < profileData.infos.length; i++) {
        const infoListItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = `${profileData.infos[i]} ${userTitle[i]}`;
        link.href = `#${userTitle[i]}`;
        infoListItem.appendChild(link);
        
        profileInfo.appendChild(infoListItem);
    }
}

function profileHtml(imageUrl, name, htmlUrl, index)  {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper";

    const card = document.createElement("div");
    card.className = "card";
    cardWrapper.appendChild(card);

    const cardImage = document.createElement("div");
    cardImage.className = "card-image";
    card.appendChild(cardImage);

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "profil one";
    cardImage.appendChild(image);

    const details = document.createElement("div");
    details.className = "details";
    card.appendChild(details);

    const title = document.createElement("h2");
    title.textContent = name;
    details.appendChild(title);

    const jobTitle = document.createElement("p");
    title.appendChild(jobTitle);
    
    const link = document.createElement("a");
    link.className = "job-title";
    link.textContent = "Profile Git";
    link.href = htmlUrl;
    link.target = "_blank";
    jobTitle.appendChild(link);

    profiles[index].appendChild(cardWrapper);
}

function reposHtml(fullName, htmlUrl, description, language) {
    const repo = document.createElement("div");
    repo.className = "repo";

    const link = document.createElement("a");
    link.textContent = fullName;
    link.href = htmlUrl;
    link.target = "_blank";
    repo.appendChild(link);

    const desc = document.createElement("p");
    desc.textContent = description;
    repo.appendChild(desc);

    const lang = document.createElement("small");
    lang.className = "repo_lang";
    lang.textContent = language;
    repo.appendChild(lang);

    repositories.appendChild(repo);
}


