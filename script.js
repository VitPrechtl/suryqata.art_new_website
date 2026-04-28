document.addEventListener("DOMContentLoaded", function () {
	var galleryFilters = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-filter]"));
	var galleryCards = Array.prototype.slice.call(document.querySelectorAll("#gallery .card[data-category]"));

	if (galleryFilters.length && galleryCards.length) {
		initializeGalleryFilters(galleryFilters, galleryCards);
	}

	initializePieceMagnifier();
});

function initializeGalleryFilters(galleryFilters, galleryCards) {
	galleryFilters.forEach(function (button) {
		button.addEventListener("click", function () {
			var selectedFilter = button.getAttribute("data-gallery-filter") || "";

			galleryFilters.forEach(function (item) {
				var isActive = item === button;
				item.classList.toggle("is-active", isActive);
				item.setAttribute("aria-pressed", isActive ? "true" : "false");
			});

			galleryCards.forEach(function (card) {
				var matches = card.getAttribute("data-category") === selectedFilter;
				card.hidden = !matches;
			});
		});

		button.setAttribute("aria-pressed", "false");
	});
}

function initializePieceMagnifier() {
	var artworkFrame = document.querySelector("#piece-detail .piece-image-artwork");
	var artworkImage = artworkFrame ? artworkFrame.querySelector("img") : null;
	var lens;
	var lensSize = 150;
	var zoom = 2.2;

	if (!artworkFrame || !artworkImage) {
		return;
	}

	lens = document.createElement("div");
	lens.className = "piece-magnifier-lens";
	lens.setAttribute("aria-hidden", "true");
	artworkFrame.appendChild(lens);

	function hideLens() {
		lens.classList.remove("is-visible");
	}

	function updateLens(event) {
		var renderedBounds = getRenderedImageBounds(artworkImage);
		var frameRect = artworkFrame.getBoundingClientRect();
		var relativeX;
		var relativeY;
		var lensLeft;
		var lensTop;

		if (!renderedBounds) {
			hideLens();
			return;
		}

		if (
			event.clientX < renderedBounds.left ||
			event.clientX > renderedBounds.left + renderedBounds.width ||
			event.clientY < renderedBounds.top ||
			event.clientY > renderedBounds.top + renderedBounds.height
		) {
			hideLens();
			return;
		}

		relativeX = event.clientX - renderedBounds.left;
		relativeY = event.clientY - renderedBounds.top;
		lensLeft = clamp(event.clientX - frameRect.left - lensSize / 2, 0, frameRect.width - lensSize);
		lensTop = clamp(event.clientY - frameRect.top - lensSize / 2, 0, frameRect.height - lensSize);

		lens.style.left = lensLeft + "px";
		lens.style.top = lensTop + "px";
		lens.style.backgroundImage = 'url("' + artworkImage.getAttribute("src") + '")';
		lens.style.backgroundSize = renderedBounds.width * zoom + "px " + renderedBounds.height * zoom + "px";
		lens.style.backgroundPosition = [
			-relativeX * zoom + lensSize / 2 + "px",
			-relativeY * zoom + lensSize / 2 + "px"
		].join(" ");
		lens.classList.add("is-visible");
	}

	artworkFrame.addEventListener("mouseenter", updateLens);
	artworkFrame.addEventListener("mousemove", updateLens);
	artworkFrame.addEventListener("mouseleave", hideLens);
	artworkImage.addEventListener("load", hideLens);
}

function getRenderedImageBounds(image) {
	var imageRect;
	var naturalRatio;
	var boxRatio;
	var renderedWidth;
	var renderedHeight;
	var offsetX = 0;
	var offsetY = 0;

	if (!image || !image.naturalWidth || !image.naturalHeight) {
		return null;
	}

	imageRect = image.getBoundingClientRect();
	naturalRatio = image.naturalWidth / image.naturalHeight;
	boxRatio = imageRect.width / imageRect.height;

	if (naturalRatio > boxRatio) {
		renderedWidth = imageRect.width;
		renderedHeight = imageRect.width / naturalRatio;
		offsetY = (imageRect.height - renderedHeight) / 2;
	} else {
		renderedHeight = imageRect.height;
		renderedWidth = imageRect.height * naturalRatio;
		offsetX = (imageRect.width - renderedWidth) / 2;
	}

	return {
		left: imageRect.left + offsetX,
		top: imageRect.top + offsetY,
		width: renderedWidth,
		height: renderedHeight
	};
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}
