# Meys - Multi-Tenant SaaS Inventory System

**M**antenimiento de **E**quipos **E**lectrónicos **y** **S**istemas.
Sistema de inventario genérico para empresas con arquitectura multi-tenant y catálogos híbridos.

## 🚀 Fases del Proyecto
- [x] FASE 0 - Setup
- [x] FASE 1 - Super Admin (Autenticación MEYS)
- [x] FASE 2 - Gestión Avanzada Super Admin (CRUD UI, Perfiles Base64, Auditoría de Acciones, Borrado Lógico de Usuarios, UI Optimista)
- [ ] FASE 3 - Empresas (Tenants)
- [ ] FASE 4 - Autenticación Empresa
- [ ] FASE 5 - Usuarios Empresa
- [ ] FASE 6 - Inventario (Activos)
- [ ] FASE 7 - Catálogos (Tipos, Categorías, Marcas)
- [ ] FASE 8 - Mantenimientos Preventivos y Correctivos
- [ ] FASE 9 - Documentación API
- [ ] FASE 10 - Testing
- [ ] FASE 11 - Deployment

## 🛠️ Stack Tecnológico
**Backend**: Node.js, NestJS, Prisma ORM, PostgreSQL
**Frontend**: React, Next.js, Tailwind CSS

## 📌 Progreso Actual
Se ha completado la **Fase 2 (Gestión Avanzada Super Admin)**. 
- Implementación de JWT reforzado.
- CRUD Completo para administradores de MEYS.
- UI Profesional (Modales transparentes, inputs de teléfono internacionales, avatares Base64).
- Sistema de Soft Delete (Borrado Lógico) con Pestañas conmutables (Activos/Eliminados).
- Registros de Auditoría (`audit_logs`) para acciones críticas y Restauración.
- Manejo optimista de estados con UX ultra-rápida.

**Próximo paso:** Fase 3 (Empresas - Arquitectura Multi-tenant SaaS).
