const contentData = [
    {
        title: "Материнская плата",
        description: "Материнская плата — это основа любого компьютера, которая соединяет все комплектующие в одну систему. " +
            "Она похожа на центральный узел, через который взаимодействуют процессор, оперативная память, видеокарта и накопители." +
            "Без материнской платы компьютер просто не сможет работать, так как она управляет обменом данными между компонентами. " +
            "Также она определяет, какие процессоры, видеокарты и модули памяти можно установить, " +
            "поэтому выбор материнской платы задает ограничения на апгрейды в будущем.",
        image: "pages/Sources/motherboard.png"
    },
    {
        title: "Процессор",
        description: "Процессор — это мозг компьютера, который выполняет все вычисления и команды. " +
            "Он отвечает за обработку данных, управление операционной системой и выполнение программ." +
            "Чем мощнее процессор, тем быстрее компьютер выполняет задачи: от простого набора текста до сложной обработки видео. " +
            "Если процессор слабый, компьютер будет \"зависать\" даже при базовых операциях.",
        image: "pages/Sources/cpu.png"
    },
    {
        title: "Видеокарта",
        description: "Видеокарта — это компонент, который отвечает за обработку и вывод изображения на экран. " +
            "Бывают встроенные (в процессор) и дискретные (отдельные)" +
            "Для офисной работы и просмотра видео встроенной видеокарты достаточно, но для игр, 3D-графики и монтажа видео требуется мощная дискретная видеокарта. " +
            "Она обрабатывает сложные графические данные, освобождая процессор для других задач.",
        image: "pages/Sources/gpu.png"
    }
];

let currentIndex = 0;

function changeComponentContent(direction) {
    currentIndex = (currentIndex + direction + contentData.length) % contentData.length;
    document.getElementById("title").innerText = contentData[currentIndex].title;
    document.getElementById("description").innerText = contentData[currentIndex].description;

    const image = document.getElementById("image");
    image.classList.add("fade-out");

    setTimeout(() => {
        image.src = contentData[currentIndex].image;
        image.classList.remove("fade-out");
        image.classList.add("fade-in");
    }, 500);

    image.classList.remove("fade-in");
}

document.getElementById("title").innerText = contentData[currentIndex].title;
document.getElementById("description").innerText = contentData[currentIndex].description;
document.getElementById("image").src = contentData[currentIndex].image;
