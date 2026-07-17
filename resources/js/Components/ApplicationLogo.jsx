export default function ApplicationLogo({ className }) {
    return (
        <img
            src="/image/logo.png"
            alt="Replate"
            className={className || "h-12 w-auto"}
        />
    );
}