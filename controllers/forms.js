const models = require('../models');
const event = require('../models/event');

exports.getAllForms = async (req, res) => {

    const { uuid } = req.params;

    try {
        const forms = await models.Form.findAll({
            where: { event: uuid },
            order: [["order", "asc"]]
        });    

        return res.status(200).json({
            forms: forms
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error fetching forms',
            error: error.message
        });
    }

}

exports.createForm = async (req, res) => {

    const { question, type, required = false, options, order = 0 } = req.body;
    const { uuid } = req.params;

    try {
        const form = await models.Form.create({
            question,
            type,
            required,
            options: options ? options : null,
            event: uuid,
            order
        });

        return res.status(201).json({
            msg: 'Form created successfully',
            form
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error creating form',
            error: error.message
        });
    }

}

// exports.bulkCreateForms = async (req, res) => {

//     const { forms } = req.body;
//     const { id } = req.params;

//     try {

//         const updatedForms = forms.map(form => ({
//             ...form,
//             event: id
//           }));

//         const createdForms = await models.Form.bulkCreate(
//             updatedForms
//         )

//         res.status(201).json({
//             msg: 'Forms created successfully',
//             forms: createdForms
//         })

//     } catch (error) {

//         console.error('Error creating forms:', error);

//         return res.status(500).json({
//             msg: 'Error creating forms',
//             error: error.message
//         });
//     }

// }

exports.bulkUpdateForms = async (req, res) => {

    const { forms } = req.body;
    const { uuid } = req.params;

    try {
        const updatedForms = await models.Form.bulkCreate(
            forms,
            {
                updateOnDuplicate: ['question', 'type', 'required', 'options', 'order'],
                where: { event: uuid }
            }
        )

        return res.status(200).json({
            msg: 'Forms updated successfully',
            forms: updatedForms
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error updating forms',
            error: error.message
        });
    }

}

exports.getFormById = async (req, res) => {

    const { formId, formUuid } = req.params;

    try {
        const form = await models.Form.findOne({
            where: { uuid: formId, event: formUuid },
        });

        if (!form) {
            return res.status(404).json({ msg: 'Form not found' });
        }

        return res.status(200).json(form);
    } catch (error) {
        return res.status(500).json({
            msg: 'Error fetching form',
            error: error.message
        });
    }

}

exports.updateForm = async (req, res) => {

    const { formId, formUuid } = req.params;
    const { question, type, required, options, order } = req.body;

    try {
        const form = await models.Form.findOne({
            where: { uuid: formId, event: formUuid },
        });

        if (!form) {
            return res.status(404).json({ msg: 'Form not found' });
        }

        form.question = question || form.question;
        form.type = type || form.type;
        form.required = required !== undefined ? required : form.required;
        form.options = options || form.options;
        form.order = order !== undefined ? order : form.order;

        await form.save();

        return res.status(200).json({
            msg: 'Form updated successfully',
            form
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error updating form',
            error: error.message
        });
    }

}
exports.deleteForm = async (req, res) => {

    const { formUuid } = req.params;

    try {
        const form = await models.Form.findOne({
            where: { uuid: formUuid },
        });

        if (!form) {
            return res.status(404).json({ msg: 'Form not found' });
        }

        await form.destroy();

        return res.status(200).json({
            msg: 'Form deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error deleting form',
            error: error.message
        });
    }

}