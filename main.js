

const   input_from = document.querySelector('.input__cities-from'),
        input_from_ul = document.querySelector('.dropdown__cities-from'),
        input_to = document.querySelector('.input__cities-to'),
        input_to_ul = document.querySelector('.dropdown__cities-to'),
        input_calendar = document.querySelector('.input__date-depart'),
        btn_submit = document.querySelector('.button button__search'),
        form = document.querySelector('.form-search');  




const   TOKEN = '3adf1a63f8bcc98a15a51ef170a6ddee',
        CITY_GET = 'http://api.travelpayouts.com/data/ru/cities.json',
        KALENDAR = 'http://min-prices.aviasales.ru/calendar_preload',
        PROXY = 'https://cors-anywhere.herokuapp.com/';

let city = '';





//===========================================================================================




//City гет запрос -------------------------------
function GetData(){
  fetch('city.json')
      .then(data => data.json())
      .then(data => city = data);

}


//showCity  --------------------------------------------------
let showCity = (input, ul) =>{

    //сформировать масив городов--------
    function formArr(input){
        let cityFilter =  city.map(item => item.name).filter(item => item !== null);
        const reg = new RegExp(`^${input.value}`, "ig");
        return cityFilter.filter(item => item.match(reg));
    }


    //рендер городов-----------------
    function renderUl(arr, ul){
        let c = '';
        arr.forEach(item => {
          c += `<li>${item}</li>`;
        });
        ul.innerHTML = c;
    }

    //вызов----------------------------
    renderUl(formArr(input), ul);

}


//отправка формы============================================================
function formSend(inpVal){
    return  city.find(item =>  item.name === inpVal);
}


//формат даты---------------------------------------------------------------
function dataFormation(date){
  let datee = new Date(date);
  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
  };
  return datee.toLocaleString("ru", options);
}


//таргет LI ------------------------------------------------------------------
function targLi(e, inp_out, inp_int){
  if(e.target.nodeName === 'LI'){
    inp_out.value = e.target.textContent;
    inp_int.textContent = '';
  }
}


//renderCard------------------------------------------
function renderCard(data, date, message){
  let  card = `
      <div><h4>${message}<h4></div>
      <div class="ticket__wrapper">
        <div class="left-side">
          <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить
            за ${data.value}₽</a>
        </div>
        <div class="right-side">
          <div class="block-left">
            <div class="city__from">Вылет из города
              <span class="city__name">${date}</span>
            </div>
            <div class="date">${dataFormation(data.depart_date)}</div>
          </div>
      
          <div class="block-right">
            <div class="changes">${data.number_of_changes > 0 ? 'с пересадками': 'без пересадок'}</div>
            <div class="city__to">Город назначения:
              <span class="city__name">${date}</span>
            </div>
          </div>
        </div>
      </div> `;
    document.querySelector('#cheapest-ticket').innerHTML = card;
}



//===========================================================================================================================================================


form.addEventListener('submit',(e)=> {

    e.preventDefault();
    let from = formSend(input_from.value);
    let to = formSend(input_to.value);

    //сформировать запрос
    const postData = '?depart_date=' + input_calendar.value + '&origin=' + from.code + '&destination=' + to.code + '&one_way=true';
  

    //запрос
    fetch(  KALENDAR +  postData)
      .then(data => data.json())
      .then(data => {

      let dateSort =  data.best_prices.sort((a, b) => {
        return +a.depart_date.replace(/-/g,'') - +b.depart_date.replace(/-/g,'');
      });

    let dataDay =  dateSort.find(item => {
          return +item.depart_date.replace(/-/g,'') === +input_calendar.value.replace(/-/g,'');
      });  
      
      let dataYer =   dateSort.find(item => {
        return +item.depart_date.replace(/-/g,'') > +input_calendar.value.replace(/-/g,'');
      }); 


      console.log(dateSort);

    //проверка если есть билет на вібраную дату
      if (dataDay) { 
        renderCard(dataDay, input_from.value, 'на етудату  есть билет!'); 
      } else { 
        renderCard(dataYer, input_from.value, 'Билетов нет!! - ближайшій рейс!!');
      }

  });//end
}); //end
 


// запрос city ------------------------------------------------------------------
GetData();


//Input -------------------------------------------------------
input_from.addEventListener('input', ()=> {
   showCity(input_from, input_from_ul);
});

input_to.addEventListener('input', ()=> {
    showCity(input_to, input_to_ul);
});



//------------------------------------------------------------
input_from_ul.addEventListener('click',(e)=> targLi(e, input_from, input_from_ul));

input_to_ul.addEventListener('click',(e)=> targLi(e, input_to, input_to_ul));

