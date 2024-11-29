const goodValueColour = 'rgb(0, 255, 0)';
const neutralValueColour = 'rgb(255, 255, 0)';
const badValueColour = 'rgb(255, 0, 0)';

const sliderMaxHeight = 100;

const computerQualitySliders = {
    perspective: {
        element: document.querySelector("#perspective .slider-strip"),
        height: sliderMaxHeight / 2,
        isBigHeightGood: true
    },
    performance: {
        element: document.querySelector("#performance .slider-strip"),
        height: sliderMaxHeight / 2,
        isBigHeightGood: true
    }
};

const priceSlider = {
    element: document.querySelector("#price .slider-strip"),
    height : sliderMaxHeight / 2,
    isBigHeightGood: false };

function updateSliderHeight(slider, heightDiff) {
    let newHeight = slider.height + heightDiff;
    if (!isSliderHeightAcceptable(newHeight))
        return;

    slider.height = newHeight;
    slider.element.style.height = slider.height + "%";
    updateSliderColour(slider);
}

function updateSliderColour(slider) {
    let newColour;

    if(slider.height > 70)
        newColour = slider.isBigHeightGood ? goodValueColour : badValueColour
    else if(slider.height < 30)
        newColour = slider.isBigHeightGood ? badValueColour : goodValueColour
    else
        newColour = neutralValueColour

    slider.element.style.background = newColour;
}

function clickComputerQualitySlider(qualitySliderId, heightDiff = 10)
{
    let clickedSlider = computerQualitySliders[qualitySliderId];
    let canChangeHeight = isSliderHeightAcceptable(clickedSlider.height + heightDiff) && isSliderHeightAcceptable(priceSlider.height + heightDiff);
    if (canChangeHeight){
        updateSliderHeight(clickedSlider, heightDiff);
        updateSliderHeight(priceSlider, heightDiff);
    }
}

function isSliderHeightAcceptable(height) {
    return height >= 0 && height <= 100;
}

function clickPriceSlider(priceHeightDiff = -10){
    if(!isSliderHeightAcceptable(priceSlider.height + priceHeightDiff))
        return;

    const totalSlidersList = Object.entries(computerQualitySliders);
    const totalSlidersCount = Object.keys(computerQualitySliders).length;

    for(let slidersCount = totalSlidersCount; slidersCount > 0; slidersCount --){
        let sliderHeightDiff = priceHeightDiff / slidersCount;

        const acceptableSliders = totalSlidersList.filter(([key, value]) =>
            isSliderHeightAcceptable(value.height + sliderHeightDiff));

        if(acceptableSliders.length === slidersCount){
            updateSliderHeight(priceSlider, priceHeightDiff);
            acceptableSliders.forEach((key, value) =>
                updateSliderHeight(key[1], sliderHeightDiff))
            return;
        }
    }
}