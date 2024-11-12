import  {Router} from "express";

const router = Router();
const products = [];

const idProducts = () => {
    let id = 0;

    products.forEach((product) => {
        if (product.id > id) {
            id = product.id;
        }
    });

    return id + 1;
};

router.get("/", (req, res) => {
    res.status(200).json({ status: "success", products });
})

router.get("/:pid", (req, res) => {
    const { pid } = req.params;

    if (isNaN(pid)) {
        return res.status(400).json({ status: "error", message: "ID debe ser un número entero" })
    }

    const product = products.find((item) => item.id === Number(pid));

    if (!product) {
        return res.status(404).json({ status: "error", message: "ID no encontrado" })
    }
    res.status(200).json({ status: "success", product });
})

router.post("/", (req, res) => {

    const {title, description, code, price, status, stock, category} = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ status: "error", message: "Faltan campos requeridos." });
    }

    const product = {
        id: idProducts(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    };

    products.push(product);
    res.status(201).json({ status: "success", product })
})

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;

    const index = products.findIndex((item) => item.id === Number(pid));

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ status: "error", message: "Faltan campos requeridos." });
    }

    if (index < 0) {
        return res.status(404).json({ status: "error", message: "ID no encontrado" })
    }

    products[index] = {
        ...products[index],
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    }

    res.status(200).json({ status: "Se actualizo el producto correctamente", product: products[index]})
})


router.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    if (isNaN(pid)) {
        return res.status(400).json({ status: "error", message: "Ingrese un número entero" })
    }
    const productId = Number(pid);

    const index = products.findIndex((item) => item.id === productId);

    if (index < 0) {
        return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    products.splice(index, 1);

    res.status(200).json({ status: "success", message: "Producto eliminado correctamente"  })
});

export default router;