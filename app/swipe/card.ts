import { createProfileCard} from './swipe-mechanic';
import { SwipeMechanic } from './swipe-mechanic';

export interface ProfileCardData {
    id? : string;
    name? : string;
    age? : number;
    description? : string;
    image? : string;
}

export function createProfileStack(c : HTMLElement, profiles: ProfileCardData []) {
    if(!c.id){
        c.id = 'ProfileCard';
    }
    const createStack: HTMLElement[] = profiles.map(profile =>
        createProfileCard({
            title: profile.name ?? '',
            age: profile.age ?? undefined,
            description: profile.description ?? '',
            image: profile.image ?? ''
        })
    );
    createStack.forEach((element, index) => {
        if (profiles[index].id){
            element.dataset.id = profiles[index].id!;
            c.appendChild(element);
        }
    });
    SwipeMechanic();
    return createStack;
}