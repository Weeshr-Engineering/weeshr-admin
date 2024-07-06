export enum ENotificationPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
    NONE = "NONE"
}
export type TNotificationPriority = typeof ENotificationPriority[keyof typeof ENotificationPriority];
