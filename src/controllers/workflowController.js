// src\controllers\workflowController.js
const Workflow = require('../models/workflowModel');
const WorkflowEngine = require('../orchestrator/workflowEngine');
const logger = require('../utils/logger');

async function createWorkflow(req, res) {
    try {
        const { name, steps } = req.body;

        // Workflow veritabanına kaydediliyor
        const workflow = new Workflow({ name, steps });
        await workflow.save();

        res.status(201).json({ message: 'Workflow created successfully.', workflow });
    } catch (error) {
        logger.error(`Error creating workflow: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function startWorkflow(req, res) {
    try {
        const workflowId = req.params.id;
        const workflow = await Workflow.findById(workflowId);

        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found.' });
        }

        const engine = new WorkflowEngine(workflow);
        await engine.run();

        res.json({ message: 'Workflow started successfully.' });
    } catch (error) {
        logger.error(`Error starting workflow: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Workflow'u mesajla başlatmak için dinleyici
async function startWorkflowListener({ value }) {
    const { steps, name, id } = value; // ID, steps ve diğer gerekli bilgileri alıyoruz
    try {
        let workflow;

        if (id) {
            // Eğer ID gönderildiyse veritabanında kontrol et
            workflow = await Workflow.findById(id);

            if (!workflow) {
                logger.error(`Workflow ID ${id} bulunamadı.`);
                return;
            }

            logger.info(`Workflow ID ${id} bulundu.`);
        } else if (name && steps) {
            // Eğer ID yoksa, isme göre kontrol et ve kaydet
            workflow = await Workflow.findOne({ name });

            if (!workflow) {
                workflow = new Workflow({ name, steps });
                await workflow.save();
                logger.info(`Yeni workflow ${name} başarıyla kaydedildi.`);
            } else {
                logger.info(`Workflow ${name} zaten mevcut.`);
            }
        } else {
            logger.error('Eksik veya geçersiz workflow verisi alındı.');
            return;
        }

        // Workflow işleyicisini başlat
        const engine = new WorkflowEngine(workflow);
        await engine.run();

        logger.info(`Workflow ${workflow.name} başarıyla tamamlandı.`);
    } catch (error) {
        logger.error(`Workflow çalıştırma hatası: ${error.message}`);
    }
}


module.exports = { startWorkflow, createWorkflow, startWorkflowListener };