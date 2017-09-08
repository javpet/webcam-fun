const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
	navigator.mediaDevices
		.getUserMedia({
			video: true,
			audio: false
		}) // this will return a promise
		.then(localMediaStream => {
			console.log(localMediaStream);
			video.src = window.URL.createObjectURL(localMediaStream);
			// without video.play() we can only see 1 frame on the screen
			video.play();
		})
		.catch(err => {
			console.log("OH NO!", err);
		});
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.height = height;
	canvas.width = width;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);

		// Take the pixels out
		let pixels = ctx.getImageData(0, 0, width, height);

		// Starting to mess with the pixels
		pixels = redEffect(pixels);
		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

function takePhoto() {
	// play the sound like taking a photo
	snap.currentTime = 0;
	snap.play();

	// take the data out of the canvas
	const data = canvas.toDataURL("image/jpeg");
	const link = document.createElement("a");
	link.href = data;
	link.setAttribute("download", "handsome");
	link.innerHTML = `<img src="${data}" alt=""/>`;
	strip.insertBefore(link, strip.firstChild);
}

function redEffect() {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100; //This is going to be the red channel
		pixels.data[i + 1] = pixels.data[i + 1] - 50; // green channel
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue channel
		pixels.data[i + 3]; // alpha channel
	}
	return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
