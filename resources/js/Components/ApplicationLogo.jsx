export default function ApplicationLogo({ className }) {
    return (
        <img
            src="/image/logo(2).png"
            alt="Replate"
            className={className || "h-12 w-auto"}
        />
    );
}