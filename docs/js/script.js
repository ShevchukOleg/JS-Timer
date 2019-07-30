const Timer = function () {
    let timer_container;
    let end_time_container;
    let countdown;
    /**
     * init - инициализировать наш модуль
     */
    function init(settings) {
        timer_container = document.querySelector(settings.timer_container);
        end_time_container = document.querySelector(settings.timer_end_date_container);
        return this;
    }

    /**
     * start - запускать таймер на указанное время в секундах
     */
    function start(seconds) {
        if (!seconds || typeof seconds !== "number") return console.log("Please provide seconds");

        clearInterval(countdown);

        const now = Date.now();
        const end = now + seconds * 1000;

        _display_time_left(seconds);
        _display_end_time(end);

        // вывести в разметку таймер и дату окончания работы таймера
        countdown = setInterval(() => {
            const second_left = Math.round((end - Date.now()) / 1000);
            
            if (second_left < 0) return clearInterval(countdown);
            
            _display_time_left(second_left);
        }, 1000);
    } 

    /**
     * stop - принудительно останавливать таймер
     */
    function stop() {
        clearInterval(countdown);
        timer_container.textContent = "";
        end_time_container.textContent = "";
    }

    function _display_time_left(seconds) {
        let days;

        if (Math.floor(seconds/86400) >= 1) {
            days = Math.floor(seconds / 86400) + "d ";
        }else {
            days = '';
        }

        const hours = Math.floor(seconds / 3600) % 24;
        const minutes = Math.floor(seconds / 60) % 60;
        const reminder_seconds = seconds % 60;
        
        const display = `${days}${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${reminder_seconds < 10 ? "0" : ""}${reminder_seconds}`;
        timer_container.textContent = display;
        document.title = display;
    }

    function _display_end_time(timestamp) {
        const end_date = new Date(timestamp);
        const year = end_date.getFullYear();
        const month = end_date.toLocaleString("ru", {month: "long"});
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятниица', 'Субота'];
        const day = days[end_date.getDay()];
        const hour = end_date.getHours();
        const minutes = end_date.getMinutes();

        const display = `Be back at ${day}, ${month} ${end_date.getDate()}, ${year}, ${hour}:${minutes < 10 ? "0" : ""}${minutes} `;
        end_time_container.textContent = display;
    }

    return  {
        init,
        start, 
        stop
    }
}

const btns = document.querySelectorAll("[data-time]");
const reset_btn = document.querySelector(".stop__button");
const input_field = document.querySelector("form#custom");




const my_timer1 = Timer().init({
    timer_container: ".display__time-left",
    timer_end_date_container: ".display__end-time"
});

function onClickHandler(e) {
    let seconds = Number(this.dataset.time);
    my_timer1.start(seconds);
}

input_field.addEventListener("submit", onSubmitHandler);

function onSubmitHandler(e) {
    e.preventDefault();
    let input_value = input_field.elements["minutes"].value
    let seconds;
    !isNaN(input_value) ? seconds = Number(input_value) * 60 : alert("Введите количество минут");
    my_timer1.start(seconds);
    setTimeout (input_field.reset(), 1);
}

btns.forEach(btn => btn.addEventListener("click", onClickHandler));
reset_btn.addEventListener("click", my_timer1.stop);


