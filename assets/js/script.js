// APIs
const store = {
    mainAPI: "https://fakestoreapi.com",
    endPoints: {
        allProducts: "products",
        categories: "products/categories",
        electronics: "products/category/electronics",
        jewelery: "products/category/jewelery",
        menClothing: "products/category/men%27s%20clothing",
        womenClothing: "products/category/women%27s%20clothing",
    },
    query: {
        sort: {
            key: "sort",
            desc: "desc",
            asc: "asc"
        },
        limit: "limit"
    },
    fireFetch: async (api) => {
        let retVal = undefined;
        const res = await fetch(api);
        if (res.ok) {
            retVal = await res.json();
        }
        return retVal;
    },
    getCategories: async (sort, limit) => {
        return await store.fireFetch(`${store.mainAPI}/${store.endPoints.categories}?${store.query.sort.key}=${sort}&${store.query.limit}=${limit}`);
    },
    getAllProducts: async (sort, limit) => {
        return await store.fireFetch(`${store.mainAPI}/${store.endPoints.allProducts}?sort=${sort}&limit=${limit}`);
    },
    getElectronicsCategory: async (sort, limit) => {
        return await store.fireFetch(`${store.mainAPI}/${store.endPoints.electronics}?sort=${sort}&limit=${limit}`);
    },
    getJeweleryCategory: async (sort, limit) => {
        return await store.fireFetch(`${store.mainAPI}/${store.endPoints.jewelery}?sort=${sort}&limit=${limit}`);
    },
    getMenClothingCategory: async (sort, limit) => {
        return await store.fireFetch(`${store.mainAPI}/${store.endPoints.menClothing}?sort=${sort}&limit=${limit}`);
    },
    getWomenClothingCategory: async (sort, limit) => {
        return await store.fireFetch(`${store.mainAPI}/${store.endPoints.womenClothing}?sort=${sort}&limit=${limit}`);
    }
};

// user options input
const user = {
    sort: {
        desc: "desc",
        asc: "asc"
    },
    require: {
        categoriesNames: "categoriesNames",
        allProducts: "allProducts",
        category: {
            electronics: "electronics",
            jewelery: "jewelery",
            menClothing: "menClothing",
            womenClothing: "womenClothing"
        }
    },
    getData: async (task, sort = "asc", limit = 0) => {
        let retVal = undefined;
        switch (task) {
            case user.require.categoriesNames:
                retVal = await store.getCategories(sort, limit);
                break;
            case user.require.allProducts:
                retVal = await store.getAllProducts(sort, limit);
                break;
            case user.require.category.electronics:
                retVal = await store.getElectronicsCategory(sort, limit);
                break;
            case user.require.category.jewelery:
                retVal = await store.getJeweleryCategory(sort, limit);
                break;
            case user.require.category.menClothing:
                retVal = await store.getMenClothingCategory(sort, limit);
                break;
            case user.require.category.womenClothing:
                retVal = await store.getWomenClothingCategory(sort, limit);
                break;
            default:
                break;
        }
        return retVal;
    }
};

// Navbar items click action
(() => {
    const navItems = Array.from(document.querySelector("#navItems").querySelectorAll("a"));
    navItems.forEach((navItem) => {
        navItem.addEventListener("click", () => {
            navItems.forEach((navItem) => {
                navItem.classList.remove("active");
                navItem.removeAttribute("aria-current");
            })
            navItem.classList.add("active");
            navItem.setAttribute("aria-current", "page");
        })
    });
})();

const carouselTrack = () => {
    const observer = new MutationObserver((mutationList, observer) => {
        mutationList.forEach((mutation) => {
            if ((mutation.type === 'attributes') && (mutation.attributeName === 'class')) {
                if ((mutation.oldValue !== mutation.target.className) && (mutation.target.className === "carousel-item active")) {
                    // console.log(mutation.oldValue, mutation.target.className);
                    [...document.querySelectorAll("button[data-bs-slide-to]")].forEach((btn) => {
                        btn.classList.remove("active");
                    });
                    document.querySelector(
                        `button[data-bs-slide-to="${mutation.target.getAttribute("data-index")}"]`
                    ).classList.add("active");
                    // observer.disconnect();
                }
            }
        });
    });
    observer.observe(document.querySelector(".carousel-inner"), {
        attributes: true,
        subtree: true,
        attributeOldValue: true,
        attributeFilter: ["class"]
    });
};

const changeCategoryBtnStyle = (btnsList, btn) => {
    btnsList.forEach((btn) => {
        btn.classList.remove("btn-active");
        btn.querySelector("svg").classList.remove("svg-active");
    });
    btn.classList.add("btn-active");
    btn.querySelector("svg").classList.add("svg-active");
};

const fetchCategoryData = async (category, sort = user.sort.asc, limit = 0) => {
    return await user.getData(category, sort, limit);
};

const displayCategoryData = (data) => {
    document.querySelector("#sellingSec").innerHTML = `
        <div class="container">
            <div class="header d-flex justify-content-between mb-3">
                <h4 class="text-capitalize">Best Selling Products</h4>
                <div class="sort-btns">
                    <button class="mx-1" data-sort="${user.sort.asc}">
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <button class="mx-1" data-sort="${user.sort.desc}">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                </div>
            </div>
            <div class="content mb-5">
                <div class="row gx-4 gy-5">
                    ${
                        data.map(item => `
                            <div class="item-cont col-12 col-md-4 col-lg-3 col-xl-2">
                                <div class="position-relative p-4 w-100">
                                    <img src="${item["image"]}" alt="" class="w-100 object-fit-contain" style="height: 250px">
                                    <div class="position-absolute top-0 end-0">
                                        <button class="border-0 rounded-5 d-flex justify-content-center align-items-center m-2">
                                            <i class="fa-regular fa-heart d-block"></i>
                                        </button>
                                        <button class="border-0 rounded-5 d-flex justify-content-center align-items-center m-2">
                                            <i class="fa-regular fa-eye d-block"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="me-auto">
                                    <p class="my-2 fw-medium text-nowrap overflow-hidden" data-bs-toggle="tooltip" data-bs-title="${item["title"]}">
                                        ${item["title"].split(" ").slice(0, 3).join(" ")}
                                    </p>
                                    <div>
                                        <span class="text-danger fw-bold">$${item["price"]}</span>
                                        <span class="text-decoration-line-through">$${Math.round(item["price"] * 1.3)}</span>
                                    </div>
                                    <div>
                                        ${(() => {
                                        let stars = "";
                                        // loop over filled stars
                                        for(let i = 0; i < Math.trunc(item["rating"]["rate"]); i++) {
                                            stars += `<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33"/>
                                                        </svg>`;
                                        }
                                        // check if there half-filled-star
                                        if(Math.round(Number((item["rating"]["rate"] - Math.trunc(item["rating"]["rate"])).toFixed(1)))) {
                                            stars += `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.99993 1.83335C9.75082 1.83151 9.50631 1.90038 9.29478 2.03196C9.08326 2.16354 8.91339 2.35242 8.80493 2.57668L6.95326 6.33002L2.80993 6.93168C2.56348 6.96719 2.3319 7.071 2.14142 7.23135C1.95094 7.3917 1.80916 7.60218 1.73214 7.83896C1.65512 8.07573 1.64594 8.32935 1.70564 8.57107C1.76534 8.8128 1.89153 9.03298 2.06993 9.20668L5.06993 12.1283L4.36159 16.255C4.31946 16.5001 4.34673 16.7522 4.44032 16.9826C4.53391 17.213 4.69009 17.4127 4.89121 17.559C5.09232 17.7054 5.33036 17.7925 5.57842 17.8107C5.82648 17.8288 6.07466 17.7772 6.29493 17.6617L9.99993 15.7133V1.83335Z" fill="#FFAD33"/>
                                                            <path opacity="0.25" d="M9.99992 1.83595C10.249 1.83404 10.5 2.00001 10.5 2.00001C10.5 2.00001 11.0865 2.20807 11.1949 2.44195L13.0466 6.35634L17.1901 6.98383C17.4365 7.02086 17.6681 7.12912 17.8586 7.29635C18.0491 7.46358 18.1908 7.68309 18.2679 7.93003C18.3449 8.17697 18.3541 8.44147 18.2944 8.69357C18.2347 8.94567 18.1085 9.1753 17.9301 9.35645L14.93 12.4035L15.6384 16.7072C15.6805 16.9629 15.6532 17.2257 15.5596 17.466C15.466 17.7064 15.3099 17.9146 15.1087 18.0672C14.9076 18.2198 14.6696 18.3107 14.4215 18.3296C14.1734 18.3486 13.9253 18.2947 13.705 18.1743L9.99992 16.1423V1.83595Z" fill="black"/>
                                                        </svg>`;
                                        } else {
                                            stars += `<svg width="16" height="15" viewBox="2 2 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.99993 1.83335C9.75082 1.83151 9.50631 1.90038 9.29478 2.03196C9.08326 2.16354 8.91339 2.35242 8.80493 2.57668L6.95326 6.33002L2.80993 6.93168C2.56348 6.96719 2.3319 7.071 2.14142 7.23135C1.95094 7.3917 1.80916 7.60218 1.73214 7.83896C1.65512 8.07573 1.64594 8.32935 1.70564 8.57107C1.76534 8.8128 1.89153 9.03298 2.06993 9.20668L5.06993 12.1283L4.36159 16.255C4.31946 16.5001 4.34673 16.7522 4.44032 16.9826C4.53391 17.213 4.69009 17.4127 4.89121 17.559C5.09232 17.7054 5.33036 17.7925 5.57842 17.8107C5.82648 17.8288 6.07466 17.7772 6.29493 17.6617L9.99993 15.7133V1.83335Z" fill="#FFAD33"/>
                                                        <path opacity="0.25" d="M9.99992 1.83595C10.249 1.83404 10.5 2.00001 10.5 2.00001C10.5 2.00001 11.0865 2.20807 11.1949 2.44195L13.0466 6.35634L17.1901 6.98383C17.4365 7.02086 17.6681 7.12912 17.8586 7.29635C18.0491 7.46358 18.1908 7.68309 18.2679 7.93003C18.3449 8.17697 18.3541 8.44147 18.2944 8.69357C18.2347 8.94567 18.1085 9.1753 17.9301 9.35645L14.93 12.4035L15.6384 16.7072C15.6805 16.9629 15.6532 17.2257 15.5596 17.466C15.466 17.7064 15.3099 17.9146 15.1087 18.0672C14.9076 18.2198 14.6696 18.3107 14.4215 18.3296C14.1734 18.3486 13.9253 18.2947 13.705 18.1743L9.99992 16.1423V1.83595Z" fill="black"/>
                                                    </svg>`;
                                        }
                                        // loop over empty stars
                                        for (let i = 0; i < (5 - Math.trunc(item["rating"]["rate"]) - 1); i++) {
                                            stars += `<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#c3bdbd"/>
                                                    </svg>`;
                                        }
                                        return stars;
                                        })()}
                                        <span>(${item["rating"]["count"]})</span>
                                    </div>
                                </div>
                            </div>`).join("")
                    }
                </div>
            </div>
        </div>`;
};

const enableItemTitleTooltip = () => {
    [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
        .map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
};

const displayLoader = (container) => {
    document.querySelector(container).innerHTML = `
        <div class="loading-cont d-flex justify-content-center align-items-center">
            <span class="loader"></span>
        </div>`;
};

const renderNewData = (data) => {
    displayCategoryData(data);
    enableItemTitleTooltip();
    handleSortBtns();
}

const handleSortBtns = () => {
    const sortBtns = Array.from(document.querySelectorAll(".sort-btns button"));
    let currentCategory = "";
    sortBtns.forEach((sortBtn) => {
        sortBtn.addEventListener("click", async () => {
            if(!sortBtn.classList.contains("sort-btn-active")) {
                const categoryBtns = Array.from(document.querySelectorAll(".btn-cont > div > button"));
                for (let i = 0; i < categoryBtns.length; i++) {
                    if(categoryBtns[i].classList.contains("btn-active")) {
                        currentCategory = categoryBtns[i].getAttribute("category-data");
                        const sortType = sortBtn.getAttribute("data-sort");
                        displayLoader("#sellingSec");
                        const data = await fetchCategoryData(currentCategory, sortType);
                        if(data !== undefined) {
                            renderNewData(data);
                            document.querySelector(`button[data-sort='${sortType}']`).classList.add("sort-btn-active");
                        }
                        break;
                    }
                }
            }
        });
    });
};

const handleCategoryBtnClk = () => {
    const categoryBtns = Array.from(document.querySelectorAll(".btn-cont > div > button"));
    categoryBtns.forEach((btn) => {
        btn.addEventListener("click", async () => {
            if(!btn.classList.contains("btn-active")) {
                changeCategoryBtnStyle(categoryBtns, btn);
                displayLoader("#sellingSec");
                const data = await fetchCategoryData(btn.getAttribute("category-data"));
                if(data !== undefined) {
                    renderNewData(data);
                    document.querySelector("button[data-sort='asc']").classList.add("sort-btn-active");
                }
            }
        });
    });
};

const displayCategoriesBtns = () => {
    document.querySelector(".browse-cont").innerHTML = `
        <div class="container">
            <h3 class="text-capitalize">categories</h3>
            <h4 class="text-capitalize mt-4">Browse By Category</h4>
            <div class="btn-cont row g-4 mt-4">
                <div class="col-6 col-md-3 d-flex justify-content-center">
                    <button class="d-flex flex-column align-items-center justify-content-center p-4 rounded-2 h-100 mh-100 w-100" category-data="${user.require.category.electronics}">
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2510_193)">
                                <path d="M46.6667 9.33334H9.33333C8.04467 9.33334 7 10.378 7 11.6667V35C7 36.2887 8.04467 37.3333 9.33333 37.3333H46.6667C47.9553 37.3333 49 36.2887 49 35V11.6667C49 10.378 47.9553 9.33334 46.6667 9.33334Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16.3333 46.6667H39.6666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 37.3333V46.6667"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M35 37.3333V46.6667" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 32H48"  stroke-width="2" stroke-linecap="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2510_193">
                                    <rect width="56" height="56" fill="black"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Electronics</span>
                    </button>
                </div>
                <div class="col-6 col-md-3 d-flex justify-content-center">
                    <button class="d-flex flex-column align-items-center justify-content-center p-4 rounded-2 h-100 mh-100 w-100" category-data="${user.require.category.menClothing}">
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2510_177)">
                                <path d="M35 14H21C17.134 14 14 17.134 14 21V35C14 38.866 17.134 42 21 42H35C38.866 42 42 38.866 42 35V21C42 17.134 38.866 14 35 14Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 42V49H35V42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 14V7H35V14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="24" y1="23" x2="24" y2="34" stroke-width="2" stroke-linecap="round"/>
                                <line x1="28" y1="28" x2="28" y2="34" stroke-width="2" stroke-linecap="round"/>
                                <line x1="32" y1="26" x2="32" y2="34" stroke-width="2" stroke-linecap="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2510_177">
                                    <rect width="56" height="56" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Man’s Clothes</span>
                    </button>
                </div>
                <div class="col-6 col-md-3 d-flex justify-content-center">
                    <button class="d-flex flex-column align-items-center justify-content-center p-4 rounded-2 h-100 mh-100 w-100" category-data="${user.require.category.jewelery}">
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2510_243)">
                                <path d="M11.6667 16.3333H14C15.2377 16.3333 16.4247 15.8417 17.2998 14.9665C18.175 14.0913 18.6667 12.9044 18.6667 11.6667C18.6667 11.0478 18.9125 10.4543 19.3501 10.0168C19.7877 9.57918 20.3812 9.33334 21 9.33334H35C35.6188 9.33334 36.2123 9.57918 36.6499 10.0168C37.0875 10.4543 37.3333 11.0478 37.3333 11.6667C37.3333 12.9044 37.825 14.0913 38.7002 14.9665C39.5753 15.8417 40.7623 16.3333 42 16.3333H44.3333C45.571 16.3333 46.758 16.825 47.6332 17.7002C48.5083 18.5753 49 19.7623 49 21V42C49 43.2377 48.5083 44.4247 47.6332 45.2998C46.758 46.175 45.571 46.6667 44.3333 46.6667H11.6667C10.429 46.6667 9.242 46.175 8.36683 45.2998C7.49167 44.4247 7 43.2377 7 42V21C7 19.7623 7.49167 18.5753 8.36683 17.7002C9.242 16.825 10.429 16.3333 11.6667 16.3333"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M28 37.3333C31.866 37.3333 35 34.1993 35 30.3333C35 26.4674 31.866 23.3333 28 23.3333C24.134 23.3333 21 26.4674 21 30.3333C21 34.1993 24.134 37.3333 28 37.3333Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2510_243">
                                    <rect width="56" height="56" fill="black"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Jewellery</span>
                    </button>
                </div>
                <div class="col-6 col-md-3 d-flex justify-content-center">
                    <button class="d-flex flex-column align-items-center justify-content-center p-4 rounded-2 h-100 mh-100 w-100" category-data="${user.require.category.womenClothing}">
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2510_14)">
                                <path d="M16.3333 30.3333H13.9999C11.4226 30.3333 9.33325 32.4227 9.33325 35V42C9.33325 44.5773 11.4226 46.6667 13.9999 46.6667H16.3333C18.9106 46.6667 20.9999 44.5773 20.9999 42V35C20.9999 32.4227 18.9106 30.3333 16.3333 30.3333Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M42 30.3333H39.6667C37.0893 30.3333 35 32.4227 35 35V42C35 44.5773 37.0893 46.6667 39.6667 46.6667H42C44.5773 46.6667 46.6667 44.5773 46.6667 42V35C46.6667 32.4227 44.5773 30.3333 42 30.3333Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33325 35V28C9.33325 23.0493 11.2999 18.3014 14.8006 14.8007C18.3013 11.3 23.0492 9.33334 27.9999 9.33334C32.9506 9.33334 37.6986 11.3 41.1992 14.8007C44.6999 18.3014 46.6666 23.0493 46.6666 28V35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2510_14">
                                    <rect width="56" height="56" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Woman’s clothes</span>
                    </button>
                </div>
            </div>
        </div>`;
};

const displayCarouselImgs = (data) => {
    document.querySelector("#carouselIndicators").innerHTML = `
        <div class="carousel-indicators align-items-center">
            ${
                data.map((item, index) => {
                    return `<button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="${index}" aria-label="Slide ${index + 1}"
                                ${index === 0 ? "class=active aria-current=true" : ""}>
                            </button>`
                }).join("\n")
            }
        </div>
        <div class="carousel-inner">
            ${
                data.map((item, index) => {
                    return `<div class="carousel-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <div class="img-cont d-flex justify-content-center">
                                    <img src="${item["image"]}" class="d-block" alt="...">
                                </div>
                            </div>`
                }).join("")
            }
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    `;
};

const displayDefaultData = (data) => {
    renderNewData(data);
    document.querySelector("button[category-data='electronics']").classList.add("btn-active");
    document.querySelector("button[category-data='electronics'] svg").classList.add("svg-active");
    document.querySelector("button[data-sort='asc']").classList.add("sort-btn-active");
}


// ==================== RUN MAIN APP ===================== \\
(async () => {
    displayLoader("#carouselIndicators");
    displayLoader(".browse-cont");
    const data = await user.getData(user.require.allProducts, user.sort.asc);
    if (data !== undefined && data.length !== 0) {
        displayCarouselImgs(data.slice(0, 5));
        displayCategoriesBtns();
        carouselTrack();
        handleCategoryBtnClk();
        displayDefaultData(data.filter(item => String(item["category"]) === "electronics"));
    }
})();


