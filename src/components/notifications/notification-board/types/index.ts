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

export enum ENotificationTypes {
    WEESH_ADDED = "WEESH_ADDED",
    WEESH_FULFILLED = "WEESH_FULFILLED",
    REQUEST_PAYOUT = "REQUEST_PAYOUT"
}

export type TNotificationType = typeof ENotificationTypes[keyof typeof ENotificationTypes];

export interface INotificationPermission {
    permissions: Array<string>;
    isStrict: boolean;
}

export interface IADDED_WEESH_META {
    [key: string]: any;
}

export interface IADDED_WEESH_RESOURCE {
    weeshId: string;
    userName: string;
    avatar?: string | null;
    userId: string;
}

export interface IFULFILLED_WEESH_META {
    [key: string]: any;
}

export interface IFULFILLED_WEESH_RESOURCE {
    weeshId: string;
    userName: string;
    avatar?: string | null;
    userId: string;
}

export interface IREQUEST_PAYOUT_META {
    [key: string]: any;
}

export interface IREQUEST_PAYOUT_RESOURCE {
    userName: string;
    avatar?: string | null;
    userId: string;
    amount?: number | string;
    payoutId: string;
}


export type TDATA_META = IADDED_WEESH_META | IFULFILLED_WEESH_META | IREQUEST_PAYOUT_META;

export type TDATA_RESOURCE = IADDED_WEESH_RESOURCE | IFULFILLED_WEESH_RESOURCE | IREQUEST_PAYOUT_RESOURCE;

export interface INotificationBoardData {
    title?: string;
    metadata: TDATA_META;
    resource: TDATA_RESOURCE;
}
export interface INotification {
    _id: string;
    readBy: Array<string>;
    permissions: INotificationPermission;
    type: TNotificationType;
    priority: TNotificationPriority;
    data: INotificationBoardData;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}