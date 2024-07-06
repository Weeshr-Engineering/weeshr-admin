export enum ENotificationPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
    NONE = "NONE"
}

export type TNotificationPriority = typeof ENotificationPriority[keyof typeof ENotificationPriority];

export interface IFilters {
    priority: Array<TNotificationPriority>;
    types: Array<string>;
}

export interface IFilterValues {
    type: string;
    priority: string;
}