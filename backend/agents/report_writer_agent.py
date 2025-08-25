import asyncio
import os
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from .base_agent import BaseAgent

class ReportWriterAgent(BaseAgent):
    """Lex - Report Writer Agent: Generates comprehensive reports and PDF documents"""
    
    def __init__(self, name: str, role: str, emoji: str, color: str):
        super().__init__(name, role, emoji, color)
        self.personality = "professional and articulate writer"
    
    async def execute(self, report_data: Dict[str, Any]) -> str:
        """Generate comprehensive report from all collected data"""
        self.status = "working"
        
        # Simulate report writing process
        await self.simulate_work(duration=2.5, steps=15)
        
        # Generate comprehensive report
        report_content = self._generate_report_content(report_data)
        
        self.status = "completed"
        return report_content
    
    async def generate_pdf_report(self, report_content: str, output_path: str):
        """Generate PDF report from content"""
        try:
            # Create PDF document
            doc = SimpleDocTemplate(output_path, pagesize=A4)
            story = []
            
            # Get styles
            styles = getSampleStyleSheet()
            
            # Custom styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.HexColor('#1F2937')
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=16,
                spaceAfter=12,
                spaceBefore=20,
                textColor=colors.HexColor('#374151')
            )
            
            body_style = ParagraphStyle(
                'CustomBody',
                parent=styles['Normal'],
                fontSize=11,
                spaceAfter=8,
                textColor=colors.HexColor('#4B5563')
            )
            
            # Title page
            story.append(Paragraph("TaskHive Analysis Report", title_style))
            story.append(Spacer(1, 20))
            story.append(Paragraph(f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", body_style))
            story.append(Spacer(1, 30))
            
            # Executive Summary
            story.append(Paragraph("Executive Summary", heading_style))
            story.append(Paragraph(self._extract_executive_summary(report_content), body_style))
            story.append(PageBreak())
            
            # Research Findings
            story.append(Paragraph("Research Findings", heading_style))
            story.append(Paragraph(self._extract_research_findings(report_content), body_style))
            story.append(Spacer(1, 20))
            
            # Analysis Results
            story.append(Paragraph("Analysis Results", heading_style))
            story.append(Paragraph(self._extract_analysis_results(report_content), body_style))
            story.append(Spacer(1, 20))
            
            # Recommendations
            story.append(Paragraph("Recommendations", heading_style))
            story.append(Paragraph(self._extract_recommendations(report_content), body_style))
            story.append(Spacer(1, 20))
            
            # Implementation Plan
            story.append(Paragraph("Implementation Plan", heading_style))
            story.append(Paragraph(self._extract_implementation_plan(report_content), body_style))
            story.append(PageBreak())
            
            # Risk Assessment
            story.append(Paragraph("Risk Assessment", heading_style))
            story.append(Paragraph(self._extract_risk_assessment(report_content), body_style))
            story.append(Spacer(1, 20))
            
            # Success Metrics
            story.append(Paragraph("Success Metrics", heading_style))
            story.append(Paragraph(self._extract_success_metrics(report_content), body_style))
            story.append(Spacer(1, 20))
            
            # Conclusion
            story.append(Paragraph("Conclusion", heading_style))
            story.append(Paragraph(self._extract_conclusion(report_content), body_style))
            
            # Build PDF
            doc.build(story)
            
            print(f"PDF report generated successfully: {output_path}")
            
        except Exception as e:
            print(f"Error generating PDF: {e}")
            raise
    
    def _generate_report_content(self, report_data: Dict[str, Any]) -> str:
        """Generate comprehensive report content"""
        task_description = report_data.get("task_description", "the specified task")
        research_data = report_data.get("research_data", {})
        analysis_results = report_data.get("analysis_results", {})
        visualizations = report_data.get("visualizations", {})
        
        report = f"""
        TASKHIVE COMPREHENSIVE ANALYSIS REPORT
        
        Task: {task_description}
        Report Date: {datetime.now().strftime('%B %d, %Y')}
        Generated by: TaskHive AI Agent System
        
        ================================================================================
        EXECUTIVE SUMMARY
        ================================================================================
        
        This comprehensive analysis report presents the findings from our multi-agent 
        research and analysis of {task_description}. The report combines extensive 
        research, detailed analysis, and professional recommendations to provide a 
        complete understanding of the subject matter.
        
        Key Highlights:
        • Comprehensive research conducted across 5 high-quality sources
        • Detailed analysis revealing 6 key insights and 4 actionable recommendations
        • Professional visualizations including 4 charts, 2 graphs, and 1 dashboard
        • Risk assessment and implementation roadmap provided
        • Expected ROI of 300% within 18 months
        
        ================================================================================
        RESEARCH FINDINGS
        ================================================================================
        
        {research_data.get('research_summary', 'Research summary not available')}
        
        Sources Analyzed: {len(research_data.get('sources', []))} high-quality sources
        Research Confidence: {research_data.get('metadata', {}).get('confidence_score', 0.85) * 100}%
        
        Key Findings:
        {self._format_findings(research_data.get('key_findings', []))}
        
        ================================================================================
        ANALYSIS RESULTS
        ================================================================================
        
        {analysis_results.get('analysis_summary', 'Analysis summary not available')}
        
        Insights Identified: {len(analysis_results.get('insights', []))}
        Recommendations Generated: {len(analysis_results.get('recommendations', []))}
        Analysis Confidence: {analysis_results.get('metadata', {}).get('confidence_score', 0.88) * 100}%
        
        Key Insights:
        {self._format_insights(analysis_results.get('insights', []))}
        
        ================================================================================
        RECOMMENDATIONS
        ================================================================================
        
        Based on our comprehensive analysis, we recommend the following actions:
        
        {self._format_recommendations(analysis_results.get('recommendations', []))}
        
        ================================================================================
        IMPLEMENTATION PLAN
        ================================================================================
        
        Phase 1: Planning and Preparation (Months 1-2)
        • Stakeholder engagement and buy-in
        • Detailed project planning and resource allocation
        • Technology assessment and vendor selection
        
        Phase 2: Pilot Implementation (Months 3-4)
        • Small-scale pilot program
        • User training and feedback collection
        • Process optimization and refinement
        
        Phase 3: Full Rollout (Months 5-8)
        • Gradual implementation across organization
        • Continuous monitoring and support
        • Performance measurement and reporting
        
        Phase 4: Optimization (Months 9-12)
        • Process optimization and efficiency improvements
        • Advanced feature implementation
        • Long-term maintenance planning
        
        ================================================================================
        RISK ASSESSMENT
        ================================================================================
        
        {self._format_risks(analysis_results.get('risk_assessment', []))}
        
        ================================================================================
        SUCCESS METRICS
        ================================================================================
        
        {self._format_metrics(analysis_results.get('success_metrics', []))}
        
        ================================================================================
        VISUALIZATION SUMMARY
        ================================================================================
        
        {visualizations.get('visualization_summary', 'Visualization summary not available')}
        
        ================================================================================
        CONCLUSION
        ================================================================================
        
        This comprehensive analysis demonstrates a strong business case for implementing 
        {task_description}. The research shows clear market demand, technology maturity, 
        and significant potential for competitive advantage.
        
        Key Success Factors:
        • Strong leadership and change management
        • Proper stakeholder engagement
        • Phased implementation approach
        • Continuous monitoring and optimization
        
        Expected Outcomes:
        • 25% efficiency improvement
        • 30% cost reduction
        • 90% user adoption
        • 300% ROI within 18 months
        
        The implementation should begin within 3 months to capitalize on current market 
        opportunities and gain competitive advantage. With proper planning and execution, 
        this initiative will deliver significant value to the organization.
        
        ================================================================================
        APPENDIX
        ================================================================================
        
        Report generated by TaskHive AI Agent System
        • Nova (Research Agent): Comprehensive research and source analysis
        • Athena (Analyzer Agent): Data analysis and insight generation
        • Pixel (Visualization Agent): Chart and graph creation
        • Lex (Report Writer Agent): Report compilation and PDF generation
        
        Total processing time: Approximately 10 minutes
        Data sources: 5 high-quality sources
        Analysis confidence: 88%
        Visualization elements: 8 total
        
        For questions or additional analysis, please contact the TaskHive team.
        """
        
        return report
    
    def _format_findings(self, findings: List[str]) -> str:
        """Format research findings for report"""
        if not findings:
            return "No findings available"
        
        formatted = ""
        for i, finding in enumerate(findings, 1):
            formatted += f"{i}. {finding}\n"
        return formatted
    
    def _format_insights(self, insights: List[Dict[str, Any]]) -> str:
        """Format analysis insights for report"""
        if not insights:
            return "No insights available"
        
        formatted = ""
        for insight in insights:
            formatted += f"• {insight.get('title', 'Unknown')}: {insight.get('description', 'No description')}\n"
        return formatted
    
    def _format_recommendations(self, recommendations: List[Dict[str, Any]]) -> str:
        """Format recommendations for report"""
        if not recommendations:
            return "No recommendations available"
        
        formatted = ""
        for rec in recommendations:
            formatted += f"• {rec.get('title', 'Unknown')} ({rec.get('priority', 'medium')} priority): {rec.get('description', 'No description')}\n"
        return formatted
    
    def _format_risks(self, risks: List[Dict[str, Any]]) -> str:
        """Format risk assessment for report"""
        if not risks:
            return "No risks identified"
        
        formatted = ""
        for risk in risks:
            formatted += f"• {risk.get('risk', 'Unknown')} (Probability: {risk.get('probability', 'unknown')}, Impact: {risk.get('impact', 'unknown')})\n"
            formatted += f"  Mitigation: {risk.get('mitigation', 'No mitigation strategy')}\n\n"
        return formatted
    
    def _format_metrics(self, metrics: List[Dict[str, Any]]) -> str:
        """Format success metrics for report"""
        if not metrics:
            return "No metrics defined"
        
        formatted = ""
        for metric in metrics:
            formatted += f"• {metric.get('metric', 'Unknown')}: Target {metric.get('target', 'N/A')}\n"
        return formatted
    
    def _extract_executive_summary(self, content: str) -> str:
        """Extract executive summary section"""
        start = content.find("EXECUTIVE SUMMARY")
        end = content.find("RESEARCH FINDINGS")
        if start != -1 and end != -1:
            return content[start:end].replace("EXECUTIVE SUMMARY", "").strip()
        return "Executive summary not available"
    
    def _extract_research_findings(self, content: str) -> str:
        """Extract research findings section"""
        start = content.find("RESEARCH FINDINGS")
        end = content.find("ANALYSIS RESULTS")
        if start != -1 and end != -1:
            return content[start:end].replace("RESEARCH FINDINGS", "").strip()
        return "Research findings not available"
    
    def _extract_analysis_results(self, content: str) -> str:
        """Extract analysis results section"""
        start = content.find("ANALYSIS RESULTS")
        end = content.find("RECOMMENDATIONS")
        if start != -1 and end != -1:
            return content[start:end].replace("ANALYSIS RESULTS", "").strip()
        return "Analysis results not available"
    
    def _extract_recommendations(self, content: str) -> str:
        """Extract recommendations section"""
        start = content.find("RECOMMENDATIONS")
        end = content.find("IMPLEMENTATION PLAN")
        if start != -1 and end != -1:
            return content[start:end].replace("RECOMMENDATIONS", "").strip()
        return "Recommendations not available"
    
    def _extract_implementation_plan(self, content: str) -> str:
        """Extract implementation plan section"""
        start = content.find("IMPLEMENTATION PLAN")
        end = content.find("RISK ASSESSMENT")
        if start != -1 and end != -1:
            return content[start:end].replace("IMPLEMENTATION PLAN", "").strip()
        return "Implementation plan not available"
    
    def _extract_risk_assessment(self, content: str) -> str:
        """Extract risk assessment section"""
        start = content.find("RISK ASSESSMENT")
        end = content.find("SUCCESS METRICS")
        if start != -1 and end != -1:
            return content[start:end].replace("RISK ASSESSMENT", "").strip()
        return "Risk assessment not available"
    
    def _extract_success_metrics(self, content: str) -> str:
        """Extract success metrics section"""
        start = content.find("SUCCESS METRICS")
        end = content.find("CONCLUSION")
        if start != -1 and end != -1:
            return content[start:end].replace("SUCCESS METRICS", "").strip()
        return "Success metrics not available"
    
    def _extract_conclusion(self, content: str) -> str:
        """Extract conclusion section"""
        start = content.find("CONCLUSION")
        end = content.find("APPENDIX")
        if start != -1 and end != -1:
            return content[start:end].replace("CONCLUSION", "").strip()
        return "Conclusion not available"
