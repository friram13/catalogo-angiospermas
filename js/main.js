document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("contenedor-angiospermas");
    const contenedorCategorias = document.getElementById("contenedor-categorias");
    const contenedorMapas = document.getElementById("contenedor-mapas");
    const btnTop = document.getElementById("btn-top");
    const jsonPath = document.body.dataset.json || "../data/data-base1.json";
    const mapasJsonPath = document.body.dataset.mapasJson || "../data/mapas.json";
    const basePath = document.body.dataset.base || "..";
    const imgBase = document.body.dataset.img || "../img";

    if (contenedor || contenedorCategorias) {
        fetch(jsonPath)
            .then(res => res.json())
            .then(data => {

                if (!data.angiospermas) {
                    const msg = "<p>No hay datos</p>";
                    if (contenedor) contenedor.innerHTML = msg;
                    if (contenedorCategorias) contenedorCategorias.innerHTML = msg;
                    return;
                }

                if (contenedor) {
                    renderGrid(data.angiospermas, contenedor, basePath);
                }

                if (contenedorCategorias) {
                    renderAccordions(data.angiospermas, contenedorCategorias, basePath, imgBase);
                    initBusquedaCategorias(contenedorCategorias);
                }

            })
            .catch(err => {
                console.error(err);
                const msg = "<p>Error cargando datos</p>";
                if (contenedor) contenedor.innerHTML = msg;
                if (contenedorCategorias) contenedorCategorias.innerHTML = msg;
            });
    }

    if (contenedorMapas) {
        fetch(mapasJsonPath)
            .then(res => res.json())
            .then(data => {
                if (!data.mapas || data.mapas.length === 0) {
                    contenedorMapas.innerHTML = "<p class='sin-datos'>No hay mapas disponibles.</p>";
                    return;
                }
                renderMapas(data.mapas, contenedorMapas, imgBase);
                initMapaLightbox();
            })
            .catch(err => {
                console.error(err);
                contenedorMapas.innerHTML = "<p>Error cargando mapas</p>";
            });
    }

    if (btnTop) {
        window.addEventListener("scroll", () => {
            btnTop.style.display = window.scrollY > 200 ? "block" : "none";
        });

        btnTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

});

function renderGrid(clados, container, basePath) {
    container.innerHTML = "";

    clados.forEach(clado => {
        const card = document.createElement("div");
        card.classList.add("card-clado");

        const titulo = document.createElement("h2");
        titulo.textContent = clado.clado;
        card.appendChild(titulo);

        appendOrdenes(card, clado, basePath);
        container.appendChild(card);
    });
}

function renderAccordions(clados, container, basePath, imgBase) {
    container.innerHTML = "";

    clados.forEach(clado => {
        const item = document.createElement("div");
        item.classList.add("accordion-item");

        const header = document.createElement("button");
        header.classList.add("accordion-header");
        header.type = "button";
        header.innerHTML =
            `<span class="accordion-title">${clado.clado}</span>` +
            `<span class="accordion-meta">${contarOrdenes(clado)} órdenes</span>` +
            `<span class="accordion-icon">▼</span>`;

        const body = document.createElement("div");
        body.classList.add("accordion-body");

        const inner = document.createElement("div");
        inner.classList.add("accordion-inner");
        appendOrdenesAccordion(inner, clado, basePath, imgBase);

        body.appendChild(inner);
        header.addEventListener("click", () => toggleAccordionExclusive(item));

        item.appendChild(header);
        item.appendChild(body);
        container.appendChild(item);
    });
}

function appendOrdenes(container, clado, basePath) {
    if (clado.ordenes) {
        clado.ordenes.forEach(orden => renderOrden(container, orden, basePath));
    }

    if (clado.subclados) {
        clado.subclados.forEach(sub => {
            const subTitulo = document.createElement("h2");
            subTitulo.textContent = sub.nombre;
            subTitulo.style.marginTop = "15px";
            container.appendChild(subTitulo);

            sub.ordenes.forEach(orden => renderOrden(container, orden, basePath));
        });
    }
}

function appendOrdenesAccordion(container, clado, basePath, imgBase) {
    if (clado.ordenes) {
        clado.ordenes.forEach(orden => {
            container.appendChild(createOrdenAccordion(orden, basePath, imgBase));
        });
    }

    if (clado.subclados) {
        clado.subclados.forEach(sub => {
            const subTitulo = document.createElement("h3");
            subTitulo.classList.add("subclado-titulo");
            subTitulo.textContent = sub.nombre;
            container.appendChild(subTitulo);

            sub.ordenes.forEach(orden => {
                container.appendChild(createOrdenAccordion(orden, basePath, imgBase));
            });
        });
    }
}

function createOrdenAccordion(orden, basePath, imgBase) {
    const nombreOrden = orden.nombre || orden;
    const familias = orden.familias || [];

    const item = document.createElement("div");
    item.classList.add("accordion-item", "accordion-sub");

    const header = document.createElement("button");
    header.classList.add("accordion-header");
    header.type = "button";

    const headerImg = document.createElement("span");
    headerImg.classList.add("accordion-orden-imagen");
    const imgOrden = document.createElement("img");
    imgOrden.alt = nombreOrden;
    registrarImagenLazy(imgOrden, headerImg, urlsImagenOrden(nombreOrden, imgBase));
    headerImg.appendChild(imgOrden);

    const headerText = document.createElement("span");
    headerText.classList.add("accordion-header-text");
    headerText.innerHTML =
        `<span class="accordion-title">${nombreOrden}</span>` +
        `<span class="accordion-meta">${familias.length} familias</span>`;

    const headerIcon = document.createElement("span");
    headerIcon.classList.add("accordion-icon");
    headerIcon.textContent = "▼";

    header.appendChild(headerImg);
    header.appendChild(headerText);
    header.appendChild(headerIcon);

    const body = document.createElement("div");
    body.classList.add("accordion-body");

    if (familias.length > 0) {
        body.appendChild(crearGridTaxones(familias, nombreOrden, imgBase));
    } else {
        body.innerHTML = "<p class='sin-datos'>Sin familias registradas</p>";
    }

    header.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleAccordionExclusive(item);
    });

    item.appendChild(header);
    item.appendChild(body);
    return item;
}

function renderOrden(container, orden, base) {
    const nombreOrden = orden.nombre || orden;

    const h3 = document.createElement("h3");
    h3.textContent = nombreOrden;
    container.appendChild(h3);

    if (orden.familias && orden.familias.length > 0) {
        const ul = document.createElement("ul");

        orden.familias.forEach(familia => {
            const li = document.createElement("li");
            li.textContent = familia.nombre || familia;
            ul.appendChild(li);
        });

        container.appendChild(ul);
    }

    h3.style.cursor = "pointer";
    h3.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href =
            `${base}/orden.html?nombre=${encodeURIComponent(nombreOrden)}`;
    });
}

function toggleAccordionExclusive(item) {
    const isOpen = item.classList.contains("open");
    const parent = item.parentElement;
    const selector = item.classList.contains("accordion-sub")
        ? ":scope > .accordion-sub"
        : ":scope > .accordion-item:not(.accordion-sub)";

    parent.querySelectorAll(selector).forEach(sibling => {
        sibling.classList.remove("open");
    });

    if (!isOpen) {
        item.classList.add("open");

        if (item.classList.contains("accordion-sub")) {
            cargarImagenesOrden(item);
        } else {
            cargarImagenesClado(item);
        }
    }
}

function contarOrdenes(clado) {
    let total = clado.ordenes ? clado.ordenes.length : 0;

    if (clado.subclados) {
        clado.subclados.forEach(sub => {
            total += sub.ordenes ? sub.ordenes.length : 0;
        });
    }

    return total;
}

function crearGridTaxones(familias, nombreOrden, imgBase) {
    const grid = document.createElement("div");
    grid.classList.add("taxon-grid");

    familias.forEach(familia => {
        const nombreFamilia = familia.nombre || familia;
        const generos = familia.generos || [];

        if (generos.length > 0) {
            generos.forEach(genero => {
                grid.appendChild(
                    crearTaxonCard(genero.nombre, "Género", genero.nombre, nombreOrden, imgBase)
                );
            });
        } else {
            grid.appendChild(
                crearTaxonCard(nombreFamilia, "Familia", nombreFamilia, nombreOrden, imgBase)
            );
        }
    });

    return grid;
}

function urlsImagenTaxon(tipo, nombre, nombreOrden, imgBase) {
    const orden = sanitizarNombreArchivo(nombreOrden);
    const carpeta = tipo === "Género" ? "generos" : "familias";
    const archivo = sanitizarNombreArchivo(nombre);
    const base = `${imgBase}/ordenes/${orden}/${carpeta}/${archivo}`;

    return [`${base}.jpg`, `${base}.jpeg`, `${base}.png`];
}

function urlsImagenOrden(nombreOrden, imgBase) {
    const orden = sanitizarNombreArchivo(nombreOrden);
    const base = `${imgBase}/ordenes/${orden}/orden`;

    return [`${base}.jpg`, `${base}.jpeg`, `${base}.png`];
}

function sanitizarNombreArchivo(nombre) {
    return String(nombre)
        .replace(/[/\\?%*:|"<>]/g, "")
        .replace(/\(/g, "_")
        .replace(/\)/g, "")
        .replace(/\s+/g, "_")
        .trim();
}

function crearTaxonCard(titulo, etiqueta, valor, nombreOrden, imgBase) {
    const card = document.createElement("div");
    card.classList.add("taxon-card");

    const imgWrap = document.createElement("div");
    imgWrap.classList.add("taxon-imagen");

    const img = document.createElement("img");
    img.alt = titulo;
    registrarImagenLazy(img, imgWrap, urlsImagenTaxon(etiqueta, titulo, nombreOrden, imgBase));

    imgWrap.appendChild(img);

    const nombre = document.createElement("p");
    nombre.classList.add("taxon-nombre");
    nombre.innerHTML = `<em>${titulo}</em>`;

    const detalle = document.createElement("p");
    detalle.classList.add("taxon-etiqueta");
    detalle.innerHTML = `<strong>${etiqueta}:</strong> ${valor}`;

    card.appendChild(imgWrap);
    card.appendChild(nombre);
    card.appendChild(detalle);
    return card;
}

function registrarImagenLazy(img, contenedor, urls) {
    img.dataset.lazyUrls = JSON.stringify(urls);
    img.dataset.lazyLoaded = "false";
}

function cargarImagenLazy(img) {
    if (!img || img.dataset.lazyLoaded === "true") return;

    const contenedor = img.closest(".taxon-imagen, .accordion-orden-imagen");
    if (!contenedor) return;

    const urls = JSON.parse(img.dataset.lazyUrls || "[]");
    if (!urls.length) return;

    img.dataset.lazyLoaded = "true";
    cargarImagenConFallback(img, contenedor, urls);
}

function cargarImagenesClado(cladoItem) {
    cladoItem.querySelectorAll(".accordion-sub > .accordion-header img").forEach(cargarImagenLazy);
}

function cargarImagenesOrden(ordenItem) {
    const imgOrden = ordenItem.querySelector(":scope > .accordion-header img");
    if (imgOrden) cargarImagenLazy(imgOrden);

    ordenItem.querySelectorAll(".taxon-card img").forEach(cargarImagenLazy);
}

function cargarImagenConFallback(img, contenedor, urls) {
    let indice = 0;

    img.addEventListener("error", () => {
        indice += 1;

        if (indice < urls.length) {
            img.src = urls[indice];
            return;
        }

        contenedor.classList.add("sin-imagen");
        img.remove();
    });

    img.src = urls[0];
}

function initBusquedaCategorias(container) {
    const input = document.getElementById("buscar-categorias");
    if (!input) return;

    input.addEventListener("input", () => {
        filtrarCategorias(container, normalizarTexto(input.value.trim()));
    });
}

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function filtrarCategorias(container, query) {
    const clados = container.querySelectorAll(":scope > .accordion-item:not(.accordion-sub)");
    let visibles = 0;

    clados.forEach(cladoItem => {
        if (!query) {
            cladoItem.classList.remove("hidden-by-search", "open");
            cladoItem.querySelectorAll(".hidden-by-search").forEach(el => {
                el.classList.remove("hidden-by-search");
            });
            cladoItem.querySelectorAll(".accordion-sub").forEach(el => {
                el.classList.remove("open");
            });
            visibles += 1;
            return;
        }

        const cladoMatch = normalizarTexto(
            cladoItem.querySelector(":scope > .accordion-header .accordion-title")?.textContent || ""
        ).includes(query);

        let algunaOrdenVisible = false;

        cladoItem.querySelectorAll(".accordion-sub").forEach(ordenItem => {
            const ordenMatch = normalizarTexto(
                ordenItem.querySelector(".accordion-title")?.textContent || ""
            ).includes(query);

            let algunaTarjetaVisible = false;

            ordenItem.querySelectorAll(".taxon-card").forEach(card => {
                const cardMatch = normalizarTexto(card.textContent).includes(query);
                const mostrar = cladoMatch || ordenMatch || cardMatch;

                card.classList.toggle("hidden-by-search", !mostrar);
                if (mostrar) algunaTarjetaVisible = true;
            });

            const mostrarOrden = cladoMatch || ordenMatch || algunaTarjetaVisible;
            ordenItem.classList.toggle("hidden-by-search", !mostrarOrden);

            if (mostrarOrden) {
                algunaOrdenVisible = true;
                if (ordenMatch || algunaTarjetaVisible) {
                    ordenItem.classList.add("open");
                    cargarImagenesOrden(ordenItem);
                }
            } else {
                ordenItem.classList.remove("open");
            }
        });

        const mostrarClado = cladoMatch || algunaOrdenVisible;
        cladoItem.classList.toggle("hidden-by-search", !mostrarClado);

        if (mostrarClado) {
            visibles += 1;
            cladoItem.classList.add("open");
            cargarImagenesClado(cladoItem);
        } else {
            cladoItem.classList.remove("open");
        }
    });

    let sinResultados = container.querySelector(".busqueda-sin-resultados");

    if (query && visibles === 0) {
        if (!sinResultados) {
            sinResultados = document.createElement("p");
            sinResultados.classList.add("busqueda-sin-resultados");
            sinResultados.textContent = "No se encontraron resultados.";
            container.appendChild(sinResultados);
        }
    } else if (sinResultados) {
        sinResultados.remove();
    }
}

function renderMapas(mapas, container, imgBase) {
    container.innerHTML = "";

    mapas.forEach(mapa => {
        const card = document.createElement("article");
        card.classList.add("mapa-card");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("mapa-card-btn");

        const imgUrl = `${imgBase}/mapas/${mapa.imagen}`;

        btn.innerHTML =
            `<div class="mapa-card-imagen">` +
            `<img src="${imgUrl}" alt="${mapa.titulo}" loading="lazy">` +
            `<span class="mapa-card-zoom">Ver en detalle</span>` +
            `</div>` +
            `<div class="mapa-card-texto">` +
            `<h3>${mapa.titulo}</h3>` +
            `<p>${mapa.descripcion}</p>` +
            `</div>`;

        btn.addEventListener("click", () => {
            abrirMapaLightbox(mapa.titulo, mapa.descripcion, imgUrl);
        });

        card.appendChild(btn);
        container.appendChild(card);
    });
}

function initMapaLightbox() {
    const lightbox = document.getElementById("mapa-lightbox");
    if (!lightbox) return;

    lightbox.querySelectorAll("[data-cerrar-lightbox]").forEach(el => {
        el.addEventListener("click", cerrarMapaLightbox);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !lightbox.hidden) {
            cerrarMapaLightbox();
        }
    });
}

function abrirMapaLightbox(titulo, descripcion, imgUrl) {
    const lightbox = document.getElementById("mapa-lightbox");
    const img = document.getElementById("lightbox-imagen");
    const tituloEl = document.getElementById("lightbox-titulo");
    const descEl = document.getElementById("lightbox-descripcion");

    if (!lightbox || !img) return;

    img.src = imgUrl;
    img.alt = titulo;
    tituloEl.textContent = titulo;
    descEl.textContent = descripcion;

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".mapa-lightbox-cerrar")?.focus();
}

function cerrarMapaLightbox() {
    const lightbox = document.getElementById("mapa-lightbox");
    const img = document.getElementById("lightbox-imagen");

    if (!lightbox) return;

    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (img) img.src = "";
}
