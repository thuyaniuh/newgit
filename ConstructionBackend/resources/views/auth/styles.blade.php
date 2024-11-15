<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
    }

    body {
        background: linear-gradient(135deg, #6f86d6, #48c6ef);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .auth-content {
        display: flex;
        align-items: center;
        background: #fff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        max-width: 800px;
    }

    .auth-image {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
    }

    .auth-image img {
        width: 200px;
    }

    .auth-box {
        flex: 1;
        text-align: center;
    }

    .title {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
    }

    form input[type="email"],
    form input[type="password"],
    form input[type="text"] {
        width: 100%;
        padding: 12px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }

    .btn {
        width: 100%;
        padding: 12px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .btn:hover {
        background: #218838;
    }

    #error-message {
        color: red;
        font-size: 14px;
        margin-bottom: 10px;
    }

    p {
        margin-top: 10px;
    }

    p a {
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
    }

    p a:hover {
        text-decoration: underline;
    }
</style>