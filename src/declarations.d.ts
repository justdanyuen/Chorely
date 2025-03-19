declare module "*.jpg" {
    const value: string;
    export default value;
}

declare module "*.png" {
    const value: string;
    export default value;
}

declare module "*.css";

declare global {
    namespace JSX {
        interface Element extends React.ReactElement {}
    }
}