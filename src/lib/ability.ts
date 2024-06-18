import { createMongoAbility } from '@casl/ability';

// const permissions = JSON.parse(localStorage.getItem('permissions') || "[]")

export const ability = createMongoAbility()
export const defineAbilities = ()=> {
    const permissions = JSON.parse(sessionStorage.getItem('permissions') || "[]")
    if(permissions !== ''){
        const data = modPermissions(permissions)
        ability.update(data)
    }
    return
}

// modifies the permmissions array into a usable form
const modPermissions = (array: any) =>{
    // Create an array to hold the resulting objects
    const result: any = [];

    // Loop through each item in the array
    array.forEach((item: string)=> {
        // Split the string at the first underscore
        const [first, ...rest] = item.split('-');
        const second = rest.join('-'); // Rejoin the rest if there are multiple underscores

        // Create an object with the required structure
        const obj = { action: first, subject: second };

        // Add the object to the result array
        result.push(obj);
    });

    return result;
}