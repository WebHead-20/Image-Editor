const dragArea = document.querySelector('.drag-area'),
    dragText = document.querySelector('.drag-area .text-wrapper .text'),
    filterOptions = document.querySelectorAll(".filter button"),
    filterName = document.querySelector(".filter-info .name"),
    filterValue = document.querySelector(".filter-info .value"),
    filterSlider = document.querySelector(".slider input"),
    rotateOptions = document.querySelectorAll(".rotate button"),
    previewImg = document.querySelector(".preview-img img"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    chooseImgBtn = document.querySelector(".choose-img"),
    saveImgBtn = document.querySelector(".save-img"),
    browse = document.querySelector('.browse'),
    input = document.querySelector('.file-input');

// When user drags a file inside the dragArea
dragArea.addEventListener('dragover', (event) => {
    event.preventDefault() // preventing default behaviour
    dragText.textContent = 'Release to Upload';
});

// When the user drags a file outside the dragArea
dragArea.addEventListener('dragleave', () => {
    dragText.textContent = 'Drag & Drop';
});

// When the user drops a file inside the dragArea
dragArea.addEventListener('drop', (event) => {
    event.preventDefault() // preventing default behaviour
    file = event.dataTransfer.files[0]; // getting user dropped file
    loadImage();
});

// input event
input.addEventListener('change', function () {
    file = this.files[0]; // getting user selected file
    loadImage();
});

chooseImgBtn.onclick = () => {
    input.click(); // triggering input event
};

browse.onclick = () => {
    input.click(); // triggering input event
};

// Previewing Image
const loadImage = () => {
    let fileType = file.type; // fetching file type
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'] // Valid File types

    // Verifying file type of selected file
    if (validExtensions.includes(fileType)) {
        previewImg.src = URL.createObjectURL(file); // passing fie url as preview img src for valid file
        previewImg.addEventListener("load", () => {
            document.querySelector(".drag-area .text-wrapper").classList.add("hide"); // hiding drag text
            document.querySelector(".img-editor").classList.remove("disable"); // activating editor panel
            resetFilterBtn.click(); // triggering reset filter
        });
    }
    else {
        alert("This file is not an Image"); // displaying alert for invalid file
        dragText.textContent = 'Drag & Drop'; // reseting drag text
    }
}



// Default values
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

// filter options
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText; // displaying filter name

        // assigning values for individual filters
        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

// Updating values of slider
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`; // displaying slider value
    const selectedFilter = document.querySelector(".filter .active"); // getting selected filter

    // setting slider value as values for each filter
    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

// Rotate and Flip Buttons
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        // setting rotate values for each rotate option
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

// Reset Filter
const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0"; // reseting to default values
    rotate = 0; flipHorizontal = 1; flipVertical = 1; // reseting to default values
    filterOptions[0].click(); // reseting active filter
    applyFilter();
}

// applying filter & rotate values to preview img
const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

// Downloading Preview Image
const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

// Click Events
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);