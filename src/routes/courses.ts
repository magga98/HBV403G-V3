
import { NextFunction } from 'express';
import { getDepartmentBySlug, getCoursesByDepartmentId, insertDepartment, conditionalUpdate } from '../lib/db.js';
import { validationCheck, atLeastOneBodyValueValidator } from '../lib/validation.js';
import{ Course } from '../types.js';
import { createDepartmentHandler } from './departments.js';

export async function listCourses(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { slug } = req.params;

    const department = await getDepartmentBySlug(slug);

    if (!department) {
        return next();
    }

    const courses = await getCoursesByDepartmentId(department.id);

    if (!courses) {
        return next(new Error('unable to get Courses'));
    }

    return res.json(courses);
}

export async function getCourse(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { slug, courseId } = req.params;

    const department = await getDepartmentBySlug(slug);

    if (!department) {
        return next();
    }

    const course = await getCourseByCourseId(courseId);

    if (!course) {
        return next()
    }

    return res.json(course);
}

export async function createCoursesHandler(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { title, description } = req.body;

    const departmentToCreate: Omit<Department, 'id'> = {
        title,
        slug: slugify(title),
        description,
        courses: [],
    };

    const createdDepartment = await insertDepartment(departmentToCreate, false);

    if (!createdDepartment) {
        return next(new Error('unable to create department'));
    }

    return res.status(201).json(createdDepartment);
}

export const createDepartment = [
    stringValidator({ field: 'title', maxLength: 64}),
    stringValidator({ 
        field: 'description', 
        valueRequired: false, 
        maxLength: 1000, 
    }),
    departmentDoesNotExistValidator,
    xssSanitizer('title'),
    xssSanitizer('description'),
    validationCheck,
    genericSanitizer('title'),
    genericSanitizer('description'),
    createDepartmentHandler,
];

export const updateDepartment = [

    stringValidator({ field: 'title', maxLength: 64, optional: true}),
    stringValidator({ 
        field: 'description', 
        valueRequired: false, 
        maxLength: 1000,
        optional: true, 
    }),
    atLeastOneBodyValueValidator(['title', 'description']),
    xssSanitizer('title'),
    xssSanitizer('description'),
    validationCheck,
    updateDepartmentHandler,
];

export async function updateDepartmentHandler(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { slug } = req.params;
    const department = await getDepartmentBySlug(slug);

    if (!department) {
        return next();
    }
    const { title, description } = req.body;

    const fields = [
        typeof title === 'string' && title ? 'title' : null,
        typeof title === 'string' && title ? 'slug' : null,
        typeof description === 'string' && description ? 'description' : null,
    ];

    const values = [
        typeof title === 'string' && title ? title : null,
        typeof title === 'string' && title ? slugify(title).toLowerCase() : null,
        typeof description === 'string' && description ? description : null,
    ];
    
    console.log(fields, values);

    const updated = await conditionalUpdate(
        'department',
        department.id,
        fields,
        values,
    );

    if (!updated) {
        return next(new Error('unable to update department'));
    }
    return res.status(201).json(updateDepartment);
}

export async function deleteDepartment(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { slug } = req.params;

    const department = await getDepartmentBySlug(slug);

    if (!department) {
        return next();
    }
    
    const deletedDepartment = await deleteDepartmentById(department.id);

    if (!deletedDepartment) {
        return next(new Error('unable to delete department'));
    }

    return res.status(204).json(deletedDepartment);
}