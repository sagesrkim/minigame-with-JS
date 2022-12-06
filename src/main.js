 // 1. 큰 그림 짜기: 제이슨에 있는 데이터를 읽어와서 아이템을 전달해줄 건데 시간이 걸리니까 프로미스로 리턴해준다. 성공하면 전달 받아온 아이템즈를 이용해서 화면에 보여주는 함수(display)에 전달해준다. 버튼을 누르면 적절하게 필터링이 되도록 만들어야 하니 이벤트리스너 함수를 만들어준다. 실패 시 콘솔로 띄워준다. 


// *Fetch the items from the JSON file 아이템을 동적으로 받아오기 
function loadItems() {
    return fetch('data/data.json') // 브라우저 API fetch를 사용하여 경로나 url을 작성하면 네트워크를 통해 간단하게 데이터를 받아온다. 데이터를 성공적으로 받아오면 response 라는 오브젝트를 전달해준다. 
    .then(response => response.json()) // 받아온 데이터가 성공적이면 제이슨으로 변환하고,
    .then(json => json.items); // 제이슨에 있는 배열만 받아오기
}

// *Update the list with the given items
// 디스플레이 함수는 아이템즈를 인자로 받아오고 받아온 아이템즈 데이터를 html 요소로 변환해서 페이지에 보이도록 만들어준다. 
function displayItems(items) {
    const container = document.querySelector('.items'); // 부모 컨테이너 안에 추가해야 함 
    container.innerHTML = items.map(item => createHTMLString(item)).join(''); // innerHTML 을 이용해서 우리가 받아온 아이템즈를 li태그로 변환하는 배열로 만들어줌. 컨테이너에 추가해준다. 즉, 한 가지의 배열 형태에서 다른 배열 형태로 변환하는 것 = 맵핑. map 이용하기
    // 각각의 아이템(map의 인자)들을 createhtmlstring이라는 함수를 이용해서 li 요소 문자열로 변환해볼 것이다. 
}

// *Create HTML list item from the given data item
// 각각 아이템을 받아와 li태그로 변환하는 함수 
function createHTMLString(item) {
    return `
    <li class="item">
        <img src="${item.image}" alt="${item.type}" class="item_thumbnail" />
        <span class="item_description">${item.gender}, ${item.size}</span>
    </li>
    `;
    // 이렇게 문자열이 들어있는 배열을 한 가지 문자열로 병합하기 위해 디스플레이 함수 내부에서 innerHTML 마지막에 .join 사용
}

// 클릭이 될 때 정보들을 필터링, 최종적으로 걸러진 아이템즈를 다시 디스플레이 함수를 호출해서 최종적으로 필터된 아이들만 화면에 보일 수 있도록 만들고 싶다. 그러려면 클릭이 되었을 때 발생하는 이벤트 오브젝트 안에 우리가 원하는 정보들이 들어있도록 하고싶다. custom property 이용
// Handle button click
function onButtonClick(event, items) {
    const dataset = event.target.dataset;
    const key = dataset.key;
    const value = dataset.value;
    if (key == null || value == null) {
        return; // 키와 밸류가 없다면 아무것도 처리하지 않고 함수를 끝내겠다. 
    } 

    const filtered = items.filter(item => item[key] === value);
    console.log(filtered);
    displayItems(filtered);
    // 배열에서 특정한 데이터만 뽑아 사용하려면 filter 사용.

    // console.log(event.target.dataset.key);
    // console.log(event.target.dataset.value); // 콘솔로 찍어보면, 컨테이너 자체를 이벤트리스너로 등록했기 때문에 주변도 클릭이 됨. 다만 키 밸류를 설정해놓았기 때문에 이외의 곳은 언디파인드로 출력
}

// Make the items matching {key: value} invisivle.
// 클릭할 때마다 전체 리스트가 업데이트 되지 않고 필요한 요소만 보이도록!
// function updateItems(items, key, value) {
//     items.forEach(item => {
//         if (item.dataset[key] === value) {
//             item.classList.remove('invisible');
//         } else {
//             item.classList.add('invisible');
//         }
//     });
// }


// 버튼이 클릭되었을 때 동작하는 함수 
function setEventListners(items) {
    // 우선 로고와 버튼즈를 불러와 정의하고 이벤트리스너를 등록한다.
    const logo = document.querySelector('.logo');
    const buttons = document.querySelector('.buttons'); // 버튼이 들어있는 컨테이너 자체에 이벤트리스너를 등록할 것 => 이벤트 위임. 하나하나의 이벤트리스너를 반복해서 등록하는 것보다 버튼들이 들어있는 컨테이너에 이벤트리스너를 등록해서 한 곳에서만 핸들링할 수 있도록 만드는 방법
    logo.addEventListener('click', () => displayItems(items)); 
    // 로고를 클릭하면 모든 아이템들이 보일 수 있도록 
    buttons.addEventListener('click', event => onButtonClick(event, items)); // 버튼이 클릭되면 이벤트를 처리할 수 있도록 이벤트를 인자로 전달, 아이템즈도 전달 
}


// main
loadItems()
.then(items => {
    displayItems(items);
    setEventListners(items);
})
.catch(console.log);