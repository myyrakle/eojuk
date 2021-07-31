import { classify, dasherize } from "@angular-devkit/core/src/utils/strings";
import { snakeCase } from "snake-case";

const lowercased = (name: any) => {
    const classifiedName = classify(name);
    return classifiedName.charAt(0).toLowerCase() + classifiedName.slice(1);
};

// 식별자를 파스칼케이스로 변환
export function toPascalCase(name: string): string {
    return classify(name);
}

// 식별자를 카멜케이스로 변환
export function toCamelCase(name: string): string {
    return lowercased(name);
}

// 식별자를 스네이크케이스로 변환
export function toSnakeCase(name: string): string {
    return snakeCase(name);
}

export function convertNameCaseByOption(option: string, name: string): string {
    switch (option) {
        case "CAMEL":
            return toCamelCase(name);
        case "SNAKE":
            return toSnakeCase(name);
        case "PASCAL":
            return toPascalCase(name);
        case "NONE":
            return name;
        default:
            return name;
    }
}
