<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectDetailResource;
use App\Models\Project;
use App\Models\ProjectDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;



class ProjectDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $columns = DB::getSchemaBuilder()->getColumnListing('projects');

        $projectDetailDetail = ProjectDetail::with('project', 'projectName.projectStatuses')->when(request()->q, function ($projectDetailDetail) {
            $projectDetailDetail = $projectDetailDetail->where('status', 'like', '%' . request()->q . '%');
        })->orderBy('project_name_id')->paginate(10);

        //return with Api Resource
        return new ProjectDetailResource(true, 'List Data Project Detail Detail', $projectDetailDetail);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'project_id'   => 'required',
            'project_name_id'   => 'required',
            'sequence'   => 'required|integer|unique:project_details,sequence',
            'status'   => 'required',
            'document_attch'   => 'mimes:xls,pdf,doc,dot',
            'note'   => 'required',

        ]);



        if ($validator->fails()) {

            return response()->json($validator->errors(), 422);
        }

        if($request->hasFile('document_attch')){
            $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('document_attch')->getClientOriginalExtension();
            $filenameSimpan = $filename.'_'.time().'.'.$extension;

            $document_attch = $request->file('document_attch');
            $document_attch->storeAs('public/document', $filenameSimpan);

            $projectDetail = ProjectDetail::create([

                'project_id'   => $request->project_id,
                'project_name_id'   => $request->project_name_id,
                'sequence'   => $request->sequence,
                'status'   => $request->status,
                'document_attch'   => $filenameSimpan,
                'note'   => $request->note,
    
            ]);
        }
        else{
            $projectDetail = ProjectDetail::create([

                'project_id'   => $request->project_id,
                'project_name_id'   => $request->project_name_id,
                'sequence'   => $request->sequence,
                'status'   => $request->status,
                'document_attch'   => "",
                'note'   => $request->note,
    
            ]);
        }

        
        
         
       //create projectDetailName

        



        if ($projectDetail) {

            //return success with Api Resource
            

            return new ProjectDetailResource(true, 'Data Project Detail Berhasil Disimpan!', $projectDetail);
        }



        //return failed with Api Resource

        return new ProjectDetailResource(false, 'Data Project Detail Gagal Disimpan!', null);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $projectDetail = ProjectDetail::with('project', 'projectName.projectStatuses')->whereId($id)->first();

        if ($projectDetail) {
            return new ProjectDetailResource(true, 'Detail data ProjectDetail ', $projectDetail);
        }

        return new ProjectDetailResource(false, 'Detail data ProjectDetail tidak ditemukan', null);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectDetail $projectDetail)
    {
        $validator = Validator::make($request->all(), [
            'project_id'   => 'required',
            'project_name_id'   => 'required',
            'sequence'   => 'required|integer|unique:project_details,sequence,'.$projectDetail->id,
            'status'   => 'required',
            'document_attch'   => 'mimes:xls, pdf, doc, dot',
            'note'   => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if($request->hasFile('document_attch')){
            $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('document_attch')->getClientOriginalExtension();
            $filenameSimpan = $filename.'_'.time().'.'.$extension;

            $document_attch = $request->file('document_attch');
            $document_attch->storeAs('public/document', $filenameSimpan);

            $projectDetail->update([
                'project_id'   => $request->project_id,
                'project_name_id'   => $request->project_name_id,
                'sequence'   => $request->sequence,
                'status'   => $request->status,
                'document_attch'   => $filenameSimpan,
                'note'   => $request->note,
    
            ]);
        }
        else{
            $projectDetail->update([
                'project_id'   => $request->project_id,
                'project_name_id'   => $request->project_name_id,
                'sequence'   => $request->sequence,
                'status'   => $request->status,
                'note'   => $request->note,
    
            ]);
        }
        
        

        //update projectDetail withour image
        

        if ($projectDetail) {
            return new ProjectDetailResource(true, 'Data projectDetail berhasil di update', $projectDetail); # code...
        }

        return new ProjectDetailResource(false, 'Data projectDetail gagal di update', null);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectDetail $projectDetail)
    {
        if ($projectDetail->delete()) {
            return new ProjectDetailResource(true, 'Data projectDetail berhasil di hapus', null);
        }

        return new ProjectDetailResource(false, 'Data projectDetail gagal di hapus', null);
    }
}
