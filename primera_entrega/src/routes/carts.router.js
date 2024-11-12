import {Router} from "express";

const router = Router();
const carts = [];

const idCarts = () => {
    let id = 0;

    carts.forEach((cart) => {
        if (cart.id > id) {
            id = cart.id;
        }
    });

    return id + 1;
};

router.get("/", (req, res) => {
    res.status(200).json({ status: "success", carts });
})

router.get("/:pid", (req, res) => {
    const { pid } = req.params;

    if (isNaN(pid)) {
        return res.status(400).json({ status: "error", message: "ID debe ser un número entero" })
    }

    const cart = carts.find((item) => item.id === Number(pid));

    if (!cart) {
        return res.status(404).json({ status: "error", message: "ID no encontrado" })
    }
    res.status(200).json({ status: "success", cart });
})

router.post("/", (req, res) => {
    const {products} = req.body;

    const cart = {
        id: idCarts(),
        products,
    };

    carts.push(cart);
    res.status(201).json({ status: "success", cart })
})

router.post("/p:id", (req, res) => {
    const { id } = req.params;
    const { products } = req.body;



    const cart = {
        id: idCarts(),
        products,
    };

    carts.push(cart);
    res.status(201).json({ status: "success", cart })
})


router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const cartId = Number(cid);
    const productId = Number(pid);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productInCart = cart.products.find(p => p.id === productId);

    if (productInCart) {
        productInCart.quantity += 1;
        return res.status(200).json({status: 'success',message: 'Cantidad del producto actualizada en el carrito', cart});
    }

    cart.products.push({ id: productId, quantity: 1 });

    res.status(200).json({status: 'success', message: 'Producto agregado correctamente al carrito', cart });
});

export default router;