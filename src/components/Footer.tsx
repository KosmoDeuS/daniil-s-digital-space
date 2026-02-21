const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Daniil Rusnak. Built with ☕ and questionable decisions.
      </p>
    </footer>
  );
};

export default Footer;
