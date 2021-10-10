export function cssClasses(...classes: any[]): string {
    return classes.filter(c => !!c).join(' ')
}