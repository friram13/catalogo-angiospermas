document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("contenedor-angiospermas");

    fetch("data-base1.json")
        .then(res => res.json())
        .then(data => {

            if (!data.angiospermas) {
                contenedor.innerHTML = "<p>No hay datos</p>";
                return;
            }

            contenedor.innerHTML = "";

            data.angiospermas.forEach(clado => {

                const card = document.createElement("div");
                card.classList.add("card-clado");

                // 🧠 TITULO DEL CLADO
                const titulo = document.createElement("h2");
                titulo.textContent = clado.clado;
                card.appendChild(titulo);

                // =========================
                // 📋 ÓRDENES
                // =========================
                if (clado.ordenes) {

                    clado.ordenes.forEach(orden => {

                        const nombreOrden = orden.nombre || orden;

                        // 🔹 TÍTULO ORDEN
                        const h3 = document.createElement("h3");
                        h3.textContent = nombreOrden;
                        card.appendChild(h3);

                        // 🔹 FAMILIAS
                        if (orden.familias && orden.familias.length > 0) {

                            const ul = document.createElement("ul");

                            orden.familias.forEach(familia => {
                                const li = document.createElement("li");
                                li.textContent = familia;
                                ul.appendChild(li);
                            });

                            card.appendChild(ul);
                        }

                        // 🔥 CLICK ORDEN
                        h3.style.cursor = "pointer";
                        h3.addEventListener("click", (e) => {
                            e.stopPropagation();
                            window.location.href =
                                `orden.html?nombre=${encodeURIComponent(nombreOrden)}`;
                        });
                    });
                }

                // =========================
                // 🌿 SUBCLADOS (ej: Asteridas)
                // =========================
                if (clado.subclados) {

                    clado.subclados.forEach(sub => {

                        const subTitulo = document.createElement("h2");
                        subTitulo.textContent = sub.nombre;
                        subTitulo.style.marginTop = "15px";
                        card.appendChild(subTitulo);

                        sub.ordenes.forEach(orden => {

                            const nombreOrden = orden.nombre || orden;

                            const h3 = document.createElement("h3");
                            h3.textContent = nombreOrden;
                            card.appendChild(h3);

                            // 🔹 FAMILIAS
                            if (orden.familias && orden.familias.length > 0) {

                                const ul = document.createElement("ul");

                                orden.familias.forEach(familia => {
                                    const li = document.createElement("li");
                                    li.textContent = familia;
                                    ul.appendChild(li);
                                });

                                card.appendChild(ul);
                            }

                            // 🔥 CLICK ORDEN
                            h3.style.cursor = "pointer";
                            h3.addEventListener("click", (e) => {
                                e.stopPropagation();
                                window.location.href =
                                    `orden.html?nombre=${encodeURIComponent(nombreOrden)}`;
                            });
                        });
                    });
                }

                contenedor.appendChild(card);
            });

        })
        .catch(err => {
            console.error(err);
            contenedor.innerHTML = "<p>Error cargando datos</p>";
        });

    // =========================
    // 🔝 BOTÓN TOP
    // =========================
    const btnTop = document.getElementById("btn-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            btnTop.style.display = "block";
        } else {
            btnTop.style.display = "none";
        }
    });

    btnTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});