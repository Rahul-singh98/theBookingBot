# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


const formFields = [
    {
      name: "name",
      label: "Chatbot Name",
      type: "text",
      required: true,
      placeholder: "Enter the chatbot name",
    },
    {
      name: "hero_img",
      label: "Image URL",
      type: "text",
      required: true,
    },
    {
      name: "welcome_message",
      label: "Welcome Message",
      type: "select",
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
      ],
    },
    {
      name: "bio",
      label: "Biography",
      type: "textarea",
      placeholder: "Tell us about yourself",
    },
    {
      name: "subscribe",
      label: "Subscribe to newsletter",
      type: "checkbox",
    },
  ];