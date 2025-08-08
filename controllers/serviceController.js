const Service = require('../models/services');
const ServiceStatus = require('../models/servicesStatus');
const {generateServiceMessage} = require('../utils/messageGenerator');

const serviceController = {
    async createService(req, res) {
        try {
            const serviceData = req.body;
            const service = await Service.create(serviceData);
            const serviceDetails = await Service.findById(service.id);
            
            const message= await generateServiceMessage(serviceDetails);    


        const phone = serviceDetails.customer_phone?.replace(/\D/g, '') ;
            // Here you would integrate WhatsApp API to send message
            // const message = await generateServiceMessage(serviceDetails);
            // await sendWhatsAppMessage(serviceDetails.customer_phone, message);
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

            res.status(201).json({
                message: 'Service created successfully',
                service: serviceDetails,
                whatsappMessage: message,
                whatsappUrl
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllServices(req, res) {
        try {
            const filters = {
                status_id: req.query.status_id,
                service_date: req.query.service_date,
                jobcard_no: req.query.jobcard_no
            };
            
            const services = await Service.findAll(filters);
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getServiceById(req, res) {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateService(req, res) {
        try {
            const serviceId = req.params.id;
            const oldService = await Service.findById(serviceId);
              if (!oldService) {
                return res.status(404).json({ error: 'Service not found' });
                }
            
            const success = await Service.update(serviceId, req.body);
            if (!success) {
                return res.status(404).json({ error: 'Failed to update service' });
            }
            
            const updatedService = await Service.findById(serviceId);
            
            // If status changed, send WhatsApp message
            if (oldService.status_id !== updatedService.status_id) {
                 const message = await generateServiceMessage(updatedService);
                 const phone = updatedService.customer_phone?.replace(/\D/g, '');
               if(phone)  {
                const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
              
            return res.json({ 
                message:'service updated and status Changed. WhatsApp message generated',
                service: updatedService,
                whatsappMessage: message,
                whatsappUrl
            });
           }             
            }
            
            res.json({
                message: 'Service updated successfully',
                service: updatedService
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteService(req, res) {
        try {
            const success = await Service.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json({ message: 'Service deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async exportServices(req, res) {
        try {
            const filters = {
                status_id: req.query.status_id,
                service_date: req.query.service_date,
                jobcard_no: req.query.jobcard_no
            };
            
            const services = await Service.findAll(filters);
            const format = req.query.format || 'excel';
            
            if (format === 'excel') {
                const excelBuffer = await generateExcelFile(services, 'services');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=services.xlsx');
                res.send(excelBuffer);
            } else if (format === 'pdf') {
                const pdfBuffer = await generatePDFFile(services, 'services');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=services.pdf');
                res.send(pdfBuffer);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = serviceController;